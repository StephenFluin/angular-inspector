import { ToolMetadata } from './tool-metadata';

chrome.tabs.query({ active: true }, function (tabList) {
    const tab = tabList[0];
    chrome.runtime.sendMessage({ msg: 'get', tab: tab.id }, (response) => {
        if (response?.apps && Object.keys(response?.apps).length === 0) {
            return;
        }
        let display = document.getElementById('app_list');

        let toolList = response?.apps ? response.apps : {};

        let table = document.createElement('table');
        let tbody = document.createElement('tbody');
        for (let toolId in toolList) {
            let tr = document.createElement('tr');
            let td_1 = document.createElement('td');
            let td_2 = document.createElement('td');
            let tool = ToolMetadata[toolId] ? ToolMetadata[toolId] : {};

            if (!tool.title) tool.title = toolId;
            if (!tool.url) tool.url = ToolMetadata[''].url.replace('%s', toolId);
            if (!tool.icon) tool.icon = ToolMetadata[''].icon;

            if (toolList[toolId] != 'found') {
                tool.title = toolId + ' ' + toolList[toolId];
            }

            // use DOM to avoid error
            let link = document.createElement('a');
            let icon = document.createElement('img');

            link.target = '_blank';
            link.title = tool.title;
            link.href = tool.url;

            icon.alt = tool.title;
            icon.width = 16;
            icon.height = 16;
            icon.src = 'apps/' + tool.icon;

            let text = document.createElement('a');
            text.href = tool.url;
            text.target = '_blank';
            text.innerText = tool.title;

            link.appendChild(icon);
            td_1.appendChild(link);
            td_2.appendChild(text);
            tr.appendChild(td_1);
            tr.appendChild(td_2);
            tbody.appendChild(tr);
        }

        table.appendChild(tbody);
        display.innerHTML = '';
        display.appendChild(table);
    });
});
