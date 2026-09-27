import { tabKey, type RescanMessage } from './lib/messages.ts';
import { viewFor, type Detected, type TabRecord } from './lib/tab-state.ts';
import { Categories, getTool, type Tool } from './tool-metadata.ts';

const results = document.getElementById('results')!;
const hostEl = document.getElementById('host')!;
const summary = document.getElementById('summary')!;
const rescanButton = document.getElementById('rescan') as HTMLButtonElement;

document.getElementById('version')!.textContent = 'v' + chrome.runtime.getManifest().version;

function el<K extends keyof HTMLElementTagNameMap>(
    tag: K,
    props: Partial<HTMLElementTagNameMap[K]> = {},
    ...children: Node[]
) {
    const node = Object.assign(document.createElement(tag), props);
    node.append(...children);
    return node;
}

function showMessage(text: string, action?: { label: string; run: () => void }) {
    const box = el('div', { className: 'message' }, el('div', { textContent: text }));
    if (action) box.append(el('button', { type: 'button', textContent: action.label, onclick: action.run }));
    results.replaceChildren(box);
}

function iconFor(tool: Tool): HTMLElement {
    const letter = () => el('span', { className: 'icon letter', textContent: tool.title[0]?.toUpperCase() ?? '?' });
    if (!tool.icon) return letter();
    const img = el('img', { className: 'icon', src: 'apps/' + tool.icon, alt: '' });
    img.onerror = () => img.replaceWith(letter());
    return img;
}

function render(apps: Detected) {
    const tools = Object.keys(apps).map(getTool);
    summary.textContent = tools.length === 1 ? '1 technology detected' : `${tools.length} technologies detected`;
    if (!tools.length) {
        showMessage('Nothing detected on this page yet.');
        return;
    }

    const order = Categories.map((c) => c.name);
    tools.sort(
        (a, b) =>
            order.indexOf(a.category) - order.indexOf(b.category) ||
            a.priority - b.priority ||
            a.title.localeCompare(b.title)
    );

    const sections: HTMLElement[] = [];
    let list: HTMLUListElement | undefined;
    let category: string | undefined;
    for (const tool of tools) {
        if (tool.category !== category) {
            category = tool.category;
            list = el('ul');
            sections.push(el('section', {}, el('h2', { textContent: category }), list));
        }
        const version = apps[tool.id];
        const link = el(
            'a',
            { href: tool.url, target: '_blank', rel: 'noopener', title: tool.title },
            iconFor(tool),
            el('span', { className: 'name', textContent: tool.title })
        );
        if (version) link.append(el('span', { className: 'version', textContent: version, title: version }));
        list!.append(el('li', { className: tool.id === 'Polyfill.io' ? 'warning' : '' }, link));
    }
    results.replaceChildren(...sections);
}

async function rescan(tabId: number): Promise<boolean> {
    try {
        const message: RescanMessage = { msg: 'rescan' };
        await chrome.tabs.sendMessage(tabId, message);
        return true;
    } catch {
        // No content script in the tab: it was opened before the extension was installed or updated.
        return false;
    }
}

async function main() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) {
        showMessage('No active tab.');
        return;
    }
    const tabId = tab.id;

    let url: URL | undefined;
    try {
        url = new URL(tab.url ?? '');
    } catch {}
    hostEl.textContent = url?.hostname || tab.title || 'Angular Inspector';
    if (!url || !/^https?:$/.test(url.protocol)) {
        showMessage("Chrome doesn't allow extensions to inspect this page.");
        return;
    }

    const key = tabKey(tabId);
    const load = async () => (await chrome.storage.session.get(key))[key] as TabRecord | undefined;
    const update = (rec: TabRecord | undefined) => {
        if (rec) render(viewFor(rec, tab.url));
        return rec;
    };

    chrome.storage.session.onChanged.addListener((changes) => {
        if (changes[key]) update(changes[key].newValue as TabRecord | undefined);
    });

    rescanButton.hidden = false;
    rescanButton.onclick = async () => {
        if (!(await rescan(tabId))) showReload();
    };
    const showReload = () =>
        showMessage('This page was opened before Angular Inspector was installed or updated.', {
            label: 'Reload page',
            run: () => {
                chrome.tabs.reload(tabId);
                window.close();
            },
        });

    const rec = update(await load());
    if (rec?.docUrl) return;

    // We have nothing (or only headers) for this page: ask the content script for results now.
    if (!rec) showMessage('Scanning…');
    if (!(await rescan(tabId)) && !rec) showReload();
}

main().catch((e) => {
    console.error(e);
    showMessage('Something went wrong loading results for this page.');
});
