function parseMicroMd(str) {
  let newHTML = '';
  let registers = {
    h: 0, // header <hn> n ∈ [1,6]
    hcl: 0, // header closing </hn> n ∈ [1,6]
    emsp: 0, // Tab char to &emsp;
    p: 0, // paragraph <p>
    pcl: 0, // paragraph closing </p>
    n: 0 // newline register
    // bi: 0, // bold and italic <em> || <strong>
    // bic: 0, // bold and italic closing
    // pre: 0, // preformatted text <pre></pre> 
    // q: 0, // quote
    // ulin: 0, // unordered list init <ul>
    // ulit: 0, // unordered lsit item <li></li>
  }
  const htmlEsc = ['<', '>', '&', '\'', '"', '–', '—'];

  const lines = str.split('\n');
  const lineIters = [];

  lines.forEach((el) => {
    lineIters.push( el[Symbol.iterator]() );
  });
  
  lineIters.forEach((lineit, index) => {
    let char = lineit.next();
    console.log(lines[index])

    while (!char.done && char.value !== undefined) {
      function appendHTML(str) {
        newHTML += str;
        char = lineit.next();
      }

      // Escape HTML character entities
      if (htmlEsc.includes(char.value)) {
        switch (char.value) {
          case '<': appendHTML('&lt;'); continue;
          case '>': appendHTML('&gt;'); continue;
          case '&': appendHTML('&amp;'); continue;
          case '\'': appendHTML('&apos;'); continue;
          case '"': appendHTML('&quot;'); continue;
          case '–': appendHTML('&ndash;'); continue;
          case '—': appendHTML('&mdash;'); continue;
        }
      }
      // // Check for header symbols
      // if (char.value == '#') {
      //   registers.h += 1;
      //   // Incorrect header reset
      //   if (registers.h > 6) {
      //     registers.h = 0;
      //     newHTML += '#'.repeat(6);
      //   }
      //   char = lineit.next();
      //   continue;
      // // Space case operations
      // } else if (char.value == ' ') {
      //   // Header tag insert trigger
      //   if (registers.h > 0) {
      //     newHTML += '<h' + registers.h + '>';
      //     registers.hcl = registers.h;
      //     registers.h = -1;
      //     char = lineit.next();
      //     continue;
      //   // Tab indent &emsp; insert trigger
      //   } else if (registers.emsp > 0) {
      //     registers.emsp = 0;
      //     newHTML += '&emsp;';
      //   } else {
      //   // Tab indent &emsp; pre-insert trigger
      //     registers.emsp = 1;
      //   }
      // // Header tag close trigger
      // } else if (registers.h == -1 && char.value == '\n') {
      //   newHTML += '</h' + registers.hcl + '>';
      //   registers.h = 0;
      //   registers.hcl = 0;
      //   // Account for paragraph cleanup.
      //   registers.p = 0;
      //   registers.pcl = 0;
      // // '#' char release condition and header register reset
      // } else if (char.value != '\n') {
      //   if (registers.h > 0 && char.value != ' ') {
      //     newHTML += '#'.repeat(registers.h);
      //     registers.h = 0;
      //   }
      // }

      // Paragraph closing tag pre-trigger
      // if (char.value != '\n') {
      //   if (registers.p > 0) {
      //     registers.pcl = 1;
      //   }
      // } else if (char.value == '\n') {
      //   // Paragraph closing tag trigger (newline encountered after pre-trigger)
      //   if (registers.pcl == 1) {
      //     newHTML += '</p>'
      //     registers.p = 0;
      //     registers.pcl = 0;
      //   }
      //   // Paragraph tag trigger
      //   registers.p += 1;
      //   if (registers.p == 1) newHTML += '<p>';
      //   char = lineit.next();
      //   continue;
      // }
      
      // Untriggered register cleanup
      // if (registers.emsp > 0 && char.value != ' ') registers.emsp = 0;

      newHTML += char.value;
      char = lineit.next();
    }
  });
  console.log(newHTML)
  // const iterator = str[Symbol.iterator]();
  // let char = iterator.next();
  // new idea:
  // -> split into lines by '\n'
  // -> then analyze them char-by-char
  
  // here go mini-markdown mini-parser with char.value!
  // while (!char.done && char.value !== undefined) {
  //   function appendHTML(str) {
  //     newHTML += str;
  //     char = iterator.next();
  //   }
  
  // Nooby fix: strip it all <p></p>'s and <p><hn>'s we can catch.
  newHTML = newHTML.replaceAll(new RegExp("<p><h", "g"), '<h');
  newHTML = newHTML.replaceAll('<p></p>', '');

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
