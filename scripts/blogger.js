function parseMicroMd(str) {
  const htmlEsc = ['<', '>', '&', '\'', '"', '–', '—'];

  const lines = str.split('\n'); // Lines from text file
  const lineIters = []; // 
  let newHTML = '';

  lines.forEach((el) => {
    lineIters.push( el[Symbol.iterator]() );
  });

  let h = 0;
  // Loop for >>EACH LINE<< !!!!
  lineIters.forEach((lineit, index) => {
    let char = lineit.next();
    console.log(char)

    if (lines[index] !== "") {
      switch (char.value) {
        // HTML headers.
        case '#':
          do {
            h += 1;
            char = lineit.next();
          } while (char.value === '#') 

          if (h > 0 && h < 7) {
            newHTML += `<h${h}>` + lines[index].replaceAll('#', '').trimStart() + `</h${h}>`;
          } else {
            newHTML += '<p>' + lines[index] + '</p>';
          }

          h = 0;
          break;
        case ' ':
          // char = lineit.next();
          break;
        // Default HTML paragraphs.
        default:
          // char = lineit.next();
          newHTML += '<p>' + lines[index] + '</p>';
          break;
      }
    }
  });

  console.log(newHTML)
  return newHTML;
}

function selectPost() {
  // TODO
}

async function getPost() {
  await fetch('../posts/0000.txt', { 
    'Content-Type': 'text/plain ',
    })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Couldn't load post at ${url}; HTTP status: ${res.status}`);
      }
      return res.text();
    })
    .then((res) => {
      let postDiv = document.getElementById("post");
      postDiv.innerHTML = parseMicroMd(res);
    });
}

getPost();
