function scrapeThePage() {
    // Keep this function isolated - it can only call methods you set up in content scripts
    return document.documentElement.outerHTML;
}

document.addEventListener('DOMContentLoaded', async () => {
    updatePopupHtml();
});

function updatePopupHtml() {
    chrome.tabs.query({active: true, currentWindow: true}, ([tab]) => {
        // We have to convert the function to a string
        const scriptToExec = `(${scrapeThePage})()`;

        // Run the script in the context of the tab
        chrome.tabs.executeScript(tab.id, {code: scriptToExec}, (response) => {
            console.log('response', response)

            let routeGroups = getRoutes(response[0])

            document.getElementById('mainPopup').innerHTML = routeGroups.map(routeGroup => {
                let titleDiv = routeGroup[0].firstPathSection ? `<h1>` + routeGroup[0].firstPathSection + `</h1>` : '';

                return `<div class="route-group">` + titleDiv + routeGroup.map(route => {
                    let methods = [...route.methods].map(method => `<div class="method-item">${method}</div>`).join(' ')

                    return `<div class="route-item">
            <div class="method-container">${methods}</div>
            <div class="route-uri">${route.uri}</div>
            <div class="route-name">${route.name}</div>
        </div>`;
                }).join(' ') + `</div>`
            }).join(' ')

        });

        // Result will be an array of values from the execution
        // For testing this will be the same as the console output if you ran scriptToExec in the console
    });
}

function getRoutes(document) {
    document = (new DOMParser).parseFromString(document, 'text/html');

    let ziggyScript = [...document.scripts]
        .map(script => script.outerHTML.toLowerCase())
        .filter(script => script.includes('ziggy'))
    ;

    if (ziggyScript.length > 0) {
        // there shouldn't be more than an element
        ziggyScript = ziggyScript[0]

        // remove everything before the ziggy const declaration
        ziggyScript = ziggyScript.substring(ziggyScript.indexOf('const ziggy = ') + 'const ziggy = '.length)

        // also remove everything after what i think is always the next strip of the ziggy const
        ziggyScript = ziggyScript.substring(0, ziggyScript.indexOf(' !function'))

        // and finally trim and remove the ';' at the end
        ziggyScript = ziggyScript.trim().slice(0, -1)
        ;

        let routes = JSON.parse(ziggyScript).routes

        // parse for extra info
        Object.keys(routes).forEach(routeName => {
            routes[routeName].name = routeName
            routes[routeName].firstPathSection = routeName.substring(0, routeName.indexOf('.')) || undefined
        })


        // group by first section of the path
        routes = Object.values(routes).reduce(function (r, a) {
            r[a.firstPathSection] = r[a.firstPathSection] || [];
            r[a.firstPathSection].push(a);
            return r;
        }, Object.create(null));

        // move no group routes at the top
        routes = Object.values(routes).sort(function (x, y) {
            return x[0].firstPathSection === undefined ? -1 : y[0].firstPathSection === undefined ? 1 : 0;
        })

        return routes;
    }
}