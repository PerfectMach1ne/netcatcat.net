function parseMicroMd(str) {
  const iterator = str[Symbol.iterator]();
  let char = iterator.next();
  let newHTML = '';
  let registers = {
    h: 0, // header
    hcl: 0, // header closing
    bi: 0, // bold and italic <em> || <strong>
    bic: 0, // bold and italic closing
    pre: 0, // preformatted text <pre></pre> 
    q: 0, // quote
    ulin: 0, // unordered list init <ul>
    ulit: 0, // unordered lsit item <li></li>
    emsp: 0, // Tab char to &emsp;
  }
  const htmlEsc = ['<', '>', '&', '\'', '"', '–', '—'];
  
  // here go mini-markdown mini-parser with char.value!
  while (!char.done && char.value !== undefined) {
    // Check for header symbols
    if (char.value == '#') {
      registers.h += 1;
      // Incorrect header reset
      if (registers.h > 6) {
        registers.h = 0;
        newHTML += '#'.repeat(6);
      }
      char = iterator.next();
      continue;
    // Space case operations
    } else if (char.value == ' ') {
      // Header tag insert trigger
      if (registers.h > 0) {
        newHTML += '<h' + registers.h + '>';
        registers.hcl = registers.h;
        registers.h = -1;
        char = iterator.next();
        continue;
      // Tab indent &emsp; insert trigger
      } else if (registers.emsp > 0) {
        registers.emsp = 0;
        newHTML += '&emsp;';
      } else {
      // Tab indent &emsp; pre-insert trigger
        registers.emsp = 1;
      }
    // Header tag close trigger
    } else if (registers.h == -1 && char.value == '\n') {
      newHTML += '</h' + registers.hcl + '>';
      registers.h = 0;
      registers.hcl = 0;
    // '#' char release condition and header register reset
    } else if (registers.h > 0 && char.value != ' ' && char.value != '\n') {
      newHTML += '#'.repeat(registers.h);
      registers.h = 0;
    }

    // Escape HTML character entities
    if (htmlEsc.includes(char.value)) {
      switch (char.value) {
        case '<': newHTML += '&lt;'; char = iterator.next(); continue;
        case '>': newHTML += '&gt;'; char = iterator.next(); continue;
        case '&': newHTML += '&amp;'; char = iterator.next(); continue;
        case '\'': newHTML += '&apos;'; char = iterator.next(); continue;
        case '"': newHTML += '&quot;'; char = iterator.next(); continue;
        case '–': newHTML += '&ndash;'; char = iterator.next(); continue;
        case '—': newHTML += '&mdash;'; char = iterator.next(); continue;
      }
    }
    
    // Untriggered register cleanup
    if (registers.emsp > 0 && char.value != ' ') registers.emsp = 0;

    newHTML += char.value;
    char = iterator.next();
  }

  return newHTML;
}

function selectPost() {
  // TODO
}

async function getPost() {
  await fetch('../posts/0000_postidea2.txt', { 
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
