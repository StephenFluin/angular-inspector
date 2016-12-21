var bg = chrome.extension.getBackgroundPage();

chrome.tabs.getSelected(null,function(tab){
    chrome.extension.sendMessage({msg: "get",tab: tab.id}, function(response){
        var display = document.getElementById('app_list');

        var apps = response && response.apps ? response.apps : {};
        var html = '';

        var appinfo = bg.appinfo;
        var count = 0;

        table = document.createElement('table');
        tbody = document.createElement('tbody');
        for (var appid in apps)
        {

            tr = document.createElement('tr');
            td_1 = document.createElement('td');
            td_2 = document.createElement('td');

            app = appinfo[appid] ? appinfo[appid] : {};

            // i'm lazy to fill all kind of the information :(
            if (!app.title) app.title = appid;
            if (!app.url) app.url = appinfo[''].url.replace('%s',appid); // it's google one
            if (!app.icon) app.icon = appinfo[''].icon;

            if( apps[appid] != "-1")
            {
                app.title = appid + ' ' + apps[appid]
            }

            // use DOM to avoid error
            var link = document.createElement('a');
            var icon = document.createElement('img');

            link.target = "_blank";
            link.title = app.title;
            link.href = app.url;

            icon.alt = app.title;
            icon.width = 16;
            icon.height = 16;
            icon.src = "apps/" + app.icon;

            text = document.createElement('a');
            text.href = app.url;
            text.target = "_blank";
            text.innerText = app.title;

            link.appendChild(icon);
            td_1.appendChild(link);
            td_2.appendChild(text);
            tr.appendChild(td_1);
            tr.appendChild(td_2);
            tbody.appendChild(tr);
            count++;
        }

        table.appendChild(tbody);
        display.appendChild(table);

    });
});