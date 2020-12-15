var scrollToDate = async () => {
  let sections = document.querySelectorAll("[class*=rh-expandable-item]")
  let currentSection = sections[sections.length - 1];
  if (!currentSection) {
    return;
  }
  // Remove extra text.
  currentSection.querySelectorAll("div")[1].children[0].remove()
  const rawDate = currentSection.querySelectorAll("div")[1].innerText
  const date = new Date(rawDate);
  const today = new Date();
  if (rawDate.split(" ").length === 2) {
    date.setFullYear(today.getFullYear())
  }

  console.log(today.getFullYear(), date.getFullYear());
  if (date.getFullYear() === today.getFullYear()) {
    window.scrollTo(0, document.body.scrollHeight);
    await new Promise((resolve) => setTimeout(resolve, 250));
    await scrollToDate();
  }
}

var parse = () => {
  let csv = "Name,Action,Amount\n";
  let sections = document.querySelectorAll("[class*=rh-expandable-item]")
  let credit = 0;
  let debit = 0;

  let validActions = ["Buy", "Sell", "Expiration"]

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i].querySelectorAll("h3");
    const transactionSection = section[0];
    const priceSection = section[1];

    if (!transactionSection || !priceSection || !priceSection.innerText) {
      continue;
    }

    const transactionParts = transactionSection.innerText.split(" ");
    const action = transactionParts[transactionParts.length - 1];
    const amount = parseFloat(priceSection.innerText.replace("$", ""));
    if (!validActions.includes(action) || !amount) {
      continue;
    }


    const name = transactionParts.slice(0, transactionParts.length - 1).join(" ");

    console.log(amount)
    if (action == "Buy") {
      debit += amount;
    } else if (action == "Sell") {
      credit += amount;
    }
    csv += `${name},${action},${amount}\n`
  }

  return {
    csv,
    credit,
    debit
  };
}

const download = (content, fileName, contentType) => {
  var a = document.createElement("a");
  var file = new Blob([content], {
    type: contentType
  });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}


const getData = async () => {
  await scrollToDate()
  var { csv, credit, debit } = parse();
  download(csv, 'transactions.csv', 'text/plain');
}


const addButton = () => {
  const sideBar = document.querySelectorAll(".sidebar-content")[0].querySelectorAll("a")[0].parentElement;
  const button = document.createElement("button");

  const span = document.createElement("span");
  span.innerText = "Download Transactions"
  button.appendChild(span);

  button.style.marginTop = "16px";
  button.style.width = "100%";
  button.style.height = "56px";
  button.onclick = function () {
    getData();
    return false;
  };

  sideBar.appendChild(button);
}

(async () => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    addButton();
  } catch (e) {
    alert(e)
  }
})()

