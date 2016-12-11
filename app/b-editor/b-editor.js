
import component, { renderToDom } from 'tiny-component';
import './b-editor.less';
import componentDom from '../lib/component-dom';
import symbol from '../lib/symbol';
import bModalEditQuestion, { EVENT_DELETE, EVENT_CLOSE, EVENT_SAVE } from '../b-modal-edit-question/b-modal-edit-question';

const EVENT_SHOW_QUESTIONS = symbol('EVENT_SHOW_QUESTIONS');

const CLASS_HIDDEN_TAG_QUESTIONS = 'b-editor__menu-tag--hidden';

const menu = (questionsByTag) => `
<div class="b-editor__menu">
  ${Object.keys(questionsByTag).map((tag) => `
    <div class="b-editor__menu-tag ${CLASS_HIDDEN_TAG_QUESTIONS}">
      <a href="" onclick="return false;" class="b-editor__menu-tag-name">${tag} (${questionsByTag[tag].length})</a>
      <div class="b-editor__menu-tag-questions">
        ${
          questionsByTag[tag].map((question, index) => `
            <div class="b-editor__menu-tag-question-wr">
              <a href="" onclick="return false;" data-question-id="${question.id}" class="b-editor__menu-tag-question">${index+1}. ${question.question}</a>
            </div>
          `).join('')
        }
      </div>    
    </div>
  `).join('')}
</div>
`;


export default component(({ questionsByTag }) => `
<div class="b-editor">
  ${menu(questionsByTag)}
  
</div>
`, ({ questionsById }, { el, events, child }) => {
  const { on } = componentDom(el, events);

  on('.b-editor__menu-tag-name', 'click', (ev) => {
    if (ev.currentTarget.parentNode.classList.contains(CLASS_HIDDEN_TAG_QUESTIONS)) {
      ev.currentTarget.parentNode.classList.remove(CLASS_HIDDEN_TAG_QUESTIONS);
    } else {
      ev.currentTarget.parentNode.classList.add(CLASS_HIDDEN_TAG_QUESTIONS);
    }
    events.emit('EVENT_SHOW_QUESTIONS');
  });

  let editModal = null;

  const editQuestion = (question) => {
    if (editModal) {
      editModal.destroy();
    }

    editModal = child(bModalEditQuestion, { question });
    document.body.classList.add('modal-open');

    renderToDom(editModal, el, () => {
    });
  };


  events.on(EVENT_CLOSE, () => {
    if (editModal) {
      editModal.destroy();
    }

    document.body.classList.remove('modal-open');
  });

  events.on(EVENT_SAVE, ({ question }) => {
    alert(`Сохранено: ${question.id}`);
  });

  events.on(EVENT_DELETE, ({ question }) => {
    alert(`Удалено: ${question.id}`);
  });

  on('.b-editor__menu-tag-question', 'click', (ev) => {
    const question = questionsById[ev.currentTarget.dataset.questionId];

    editQuestion(question);
  });
});
