function parseMicroMd(str) {
  const iterator = str[Symbol.iterator]();
  let char = iterator.next();
  let newHTML = '';
  let registers = {
    h: 0,
    hcl: 0
  }
  
  // here go mini-markdown mini-parser with char.value!
  while (!char.done && char.value !== undefined) {
    // console.log(char.value);
    if (char.value == '#') {
      registers.h += 1;
      char = iterator.next();
      continue;
    } else if (char.value == ' ' && registers.h > 0) {
      newHTML += '<h' + registers.h + '>';
      registers.hcl = registers.h;
      registers.h = -1;
      char = iterator.next();
      continue;
    } else if (registers.h == -1 && char.value == '\n') {
      newHTML += '</h' + registers.hcl + '>';
      registers.h = 0;
      registers.hcl = 0;
    } else if (char.value != ' ' && char.value != '\n' && registers.h > 0) {
      newHTML += '#'.repeat(registers.h);
      registers.h = 0;
    }
    
    newHTML += char.value;
    char = iterator.next()
  }

  return newHTML;
  // console.log(newHTML);
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
      postDiv.innerText = res;
      postDiv.innerHTML = parseMicroMd(postDiv.innerText);
    });
}

getPost();
