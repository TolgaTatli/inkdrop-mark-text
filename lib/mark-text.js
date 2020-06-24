'use babel';

const { markdownRenderer } = require('inkdrop')
const mark = require('remark-mark');

module.exports = {

  activate() {
    this.subscription = inkdrop.commands.add(document.body, {
      'mark-text:toggle': ()=> {
        const cm = inkdrop.getActiveEditor().cm;
        if (cm.somethingSelected()) {
          const selection = cm.getSelection();
          if (/^==.+==$/.test(selection)) {
            cm.replaceSelection(selection.slice(2, -2), 'around');
          } else {
            cm.replaceSelection('==' + selection + '==', 'around');
          }
        } else {
          cm.replaceSelection('====', 'start');
          const {line, ch} = cm.getCursor();
          cm.setCursor({line, ch: ch + 2});
        }
      }
    });
    
    return markdownRenderer.remarkPlugins.push(mark)
  },

  deactivate() {	  
    this.subscription.dispose();
    
    if (markdownRenderer) {
      markdownRenderer.remarkPlugins = markdownRenderer.remarkPlugins.filter(
        plugin => {
          return plugin !== mark
        }
      )
    }
  }

};
