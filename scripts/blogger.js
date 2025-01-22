function iterateStr(str) {
  const iterator = str[Symbol.iterator]();
  let char = iterator.next();
  
  while (!char.done && char.value !== undefined) {
    console.log(char.value);
    // here go mini-markdown mini-parser with char.value!
    char = iterator.next()
  }
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
      iterateStr(postDiv.innerText);
    });
}

getPost();
