if(![...document.getElementsByClassName('fold-unminify')].length) { // check it is already folded
  let pathStorage = {
    codePath: '.code.highlight .line',
    linePath: '.line-numbers .diff-line-num'
  }

  const codeLines = [...document.querySelectorAll(pathStorage.codePath)];

  if (codeLines.length) {
    const codeLinesText = codeLines.map(l => l.textContent);

    let openBracesLines = [],
      closeBracesLines = [];
    codeLinesText.forEach((line, index) => {
      line = line.trim();
      if (line.includes('{') && (line.match(/{/g) || []).length > (line.match(/}/g) || []).length) {
        openBracesLines.push({
          line,
          lineNo: index
        });
      }
      if (line.includes('}') && (line.match(/}/g) || []).length > (line.match(/{/g) || []).length) {
        closeBracesLines.push({
          line,
          lineNo: index
        });
      }
    });

    // for + and - minify
    let linkColor = window.getComputedStyle(document.getElementsByTagName('a')[0]).color;
    openBracesLines.forEach(({ lineNo }) => {
      let myEle = codeLines[lineNo];
      let style = `color: ${linkColor}`;
      myEle.innerHTML=`<span class="fold-unminify" style="${style}" line-no=${lineNo}></span>${myEle.innerHTML}`;
    });

    // for braces group
    let bracesGroup = [];
    closeBracesLines.forEach(({ lineNo }) => {
      let startBraces = openBracesLines.filter(({ lineNo: index }) => index < lineNo).map(({ lineNo: index }) => index);
      startBraces = startBraces.filter((lineNo) => {
        return !bracesGroup.map(({ startIndex } = {}) => startIndex).includes(lineNo);
      });
      let startIndex = Math.max(...startBraces);
      bracesGroup.push({
        startIndex,
        endIndex: lineNo
      })
    });
    
    // for minify click
    let codeLineNumbers = [...document.querySelectorAll(pathStorage.linePath)];
    [...document.getElementsByClassName('fold-unminify')].forEach((node) => {
      node.addEventListener('click', ({ target }) => {
        let lineNo = target.getAttribute('line-no');
        let { startIndex, endIndex } = bracesGroup.find(({ startIndex }) => startIndex === +lineNo);
        let foldedLines = [...document.getElementsByClassName('fold-minify')].map((ele) => +ele.getAttribute('line-no'));
        codeLines[startIndex].classList.toggle('fold-dots');

        for (let i = startIndex + 1; i < endIndex; i++) {
          if (foldedLines.includes(i)) {
            let { endIndex: lastFoldedLineNo, startIndex: firstFoldedLineNo } = bracesGroup.find(({ startIndex }) => startIndex === i);
            codeLines[firstFoldedLineNo].classList.toggle('fold-hide');
            codeLineNumbers[firstFoldedLineNo].classList.toggle('fold-hide');
            i = lastFoldedLineNo;
          }

          codeLines[i].classList.toggle('fold-hide');
          codeLineNumbers[i].classList.toggle('fold-hide');
        }
        target.classList.toggle('fold-minify');
      });
    });
  } else {
    if (!document.getElementById('fold-alert-modal')) {
      let dialog = document.createElement('dialog');
      dialog.id = "fold-alert-modal";
      document.body.appendChild(dialog);
      dialog.innerHTML = 'The error due to any of the following two reasons\
      <ul class="fold-fail-list">\
      <li>Maybe you are not in gitlab Environment</li>\
      <li>Otherwise, gitlab changed the path of the HTML elements. Please raise an issue <a href="https://github.com/AlwarG/Gitlab-fold/issues" target="_blank" rel="noopener">here</a></li>\
      </ul>\
      <button id="fold-alert-close" class="cursor-pointer">close</button>';
    }
    if (document.getElementById('fold-alert-modal').getAttribute('open') === null) {
      let modal = document.getElementById('fold-alert-modal');
      modal.showModal();
      document.getElementById('fold-alert-close').addEventListener('click', () => modal.close());
    }
  }
}