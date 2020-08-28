var table = document.createElement("table");
[].concat(...[...document.querySelectorAll("table")].slice(0, -2).map(x => [...x.querySelectorAll("tr")])).forEach(x => {
    if (x.querySelectorAll("td")[0]) table.appendChild(x)
})
copy(table)