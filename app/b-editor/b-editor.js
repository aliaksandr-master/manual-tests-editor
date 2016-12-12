
import component, { renderToDom } from 'tiny-component';
import './b-editor.less';
import componentDom from '../lib/component-dom';
import { deleteResource, createResource, editResource } from '../lib/request';
import symbol from '../lib/symbol';
import sha1 from 'crypto-js/sha1';
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
  <button class="b-editor__add-btn btn btn-success btn-lg" type="button">Создать новый вопрос</button>
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
    events.emit(EVENT_SHOW_QUESTIONS);
  });

  let editModal = null;

  const editQuestion = (question) => {
    if (editModal) {
      editModal.destroy();
    }

    editModal = child(bModalEditQuestion, { question });
    document.body.classList.add('modal-open');

    renderToDom(editModal, el);
  };


  events.on(EVENT_CLOSE, () => {
    if (editModal) {
      editModal.destroy();
    }

    document.body.classList.remove('modal-open');
  });

  events.on(EVENT_SAVE, ({ question }) => {
    if (!question.id) {
      return createResource('/data/', question)
        .then(() => {
          window.alert(`Создан новый вопрос`);
          window.location.reload(true);
        });
    }

    return editResource(`/data/${question.id}.dat4`, question)
      .then(() => {
        window.alert(`Данные вопроса обновлены`);
        window.location.reload(true);
      });
  });

  events.on(EVENT_DELETE, ({ question }) => {
    deleteResource(`/data/${question.id}.dat4`)
      .then(() => {
        window.alert(`Удалено: ${question.id}`);
        window.location.reload(true);
      });
  });

  on('.b-editor__add-btn', 'click', () => {
    const question = {
      answers: [],
      choices: [
        ''
      ],
      question: '',
      tag: '',
      type: 'simple'
    };

    editQuestion(question);
  });

  on('.b-editor__menu-tag-question', 'click', (ev) => {
    const question = questionsById[ev.currentTarget.dataset.questionId];

    console.log(question);

    editQuestion(question);
  });
});
