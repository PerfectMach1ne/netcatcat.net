const button_ids_links = [
  ["omN-table-of-contents", "https://docs.google.com/spreadsheets/d/15nSuKrllBI4PdawNSxqVGMqnc-CjYMN8A3c6kASYd9Y/"],
  ["omN-notebook-0", "https://docs.google.com/document/d/1HBPgLziAX2HG9rgtShM1pq2n710qmQi9DLZTZBAU25E"]
];

if (window.location.pathname == "/view/omega-psi.html") {
  const buttMap = new Map(button_ids_links);
  const button_ids = Array.from(buttMap.keys());

  button_ids.forEach((id_str) => {
    let button = document.getElementById(id_str);
    button.addEventListener("click", () => {
      location.href = buttMap.get(id_str);
    })
  });
}