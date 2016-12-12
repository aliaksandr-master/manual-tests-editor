'use strict';

import component from 'tiny-component';
import componentDom from '../lib/component-dom';
import './b-modal-edit-question.less';
import symbol from '../lib/symbol';

export const EVENT_CLOSE = symbol('EVENT_CLOSE');
export const EVENT_SAVE = symbol('EVENT_SAVE');
export const EVENT_DELETE = symbol('EVENT_DELETE');

const choiceRow = ({ text = '', isTruth = false } = {}) => `
  <tr class="b-modal-edit-question__choice">
    <td>
      <textarea rows="4" class="b-modal-edit-question__choice-txt form-control" style="resize: vertical">${text}</textarea>
    </td>
    <td width="1" valign="top"><input class="b-modal-edit-question__answer" ${isTruth ? 'checked' : ''} value="1" type="checkbox"></td>
    <td width="1"><a class="b-modal-edit-question__remove-row" href="" onclick="return false;">&times;</a></td>
  </tr>
`;

export default component(({ question }) => `
<div id="b-modal-edit-question" class="b-modal-edit-question modal fade" style="display: none;">
  <div class="modal-dialog">
    <div class="modal-content">
      <form class="modal-body" onsubmit="return false;">
        <label for="">Текст Вопроса:</label>
        <textarea rows="4" name="questin" class="b-modal-edit-question__question form-control" style="resize: vertical">${question.question}</textarea>
        <br/>
        <br/>
        <label for="">Имя категории:</label>
        <input class="form-control" type="text" name="tag" placeholder="tag" value="${question.tag}"/>
        <br/>
        <br/>
        <table class="table b-modal-edit-question__choices">
          <tr>
            <th>Ответ</th>          
            <th width="1" colspan="2">Верно</th>          
          </tr>
          ${
            question.choices.map((choice, index) => 
              choiceRow({ text: choice, isTruth: question.answers.includes(index) })
            ).join('')
          }
        </table>
        <div class="clearfix">
          <button type="button" class="b-modal-edit-question__add-btn btn btn-success">Добавить вариант ответа</button>
        </div>
      </form>
      <div class="modal-footer">
        <button type="button" class="b-modal-edit-question__delete-btn btn btn-default pull-left">Удалить</button>
        <button type="button" class="b-modal-edit-question__close-btn btn btn-default">Закрыть</button>
        <button type="button" class="b-modal-edit-question__save-btn btn btn-primary">Сохранить</button>
      </div>
    </div>
  </div>
</div>
`, ({ question }, { el, events }) => {
  el.classList.add('in');
  el.style.display = 'block';

  const close = () => {
    el.classList.remove('in');
    el.style.display = 'none';
    events.$emit(EVENT_CLOSE);
  };

  const { on, serialize } = componentDom(el, events);

  let removeRowListenersCleanup = () => {};
  const initRemoveRowListeners = () => {
    removeRowListenersCleanup();
    removeRowListenersCleanup = on('.b-modal-edit-question__remove-row', 'click', (ev) => {
      const row = ev.currentTarget.parentNode.parentNode;

      row.parentNode.removeChild(row);
    });
  };

  initRemoveRowListeners();

  on('.b-modal-edit-question__save-btn', 'click', () => {
    let _question = {
      ...question,
      ...(serialize('[name]') || {})
    };

    const choices = [];
    const answers = [];

    Array.prototype.forEach.call(el.querySelectorAll('.b-modal-edit-question__choice'), (row, index) => {
      const text = row.querySelector('.b-modal-edit-question__choice-txt').value.trim();
      choices.push(text);

      if (row.querySelector('.b-modal-edit-question__answer:checked')) {
        answers.push(index);
      }
    });

    _question.tag = _question.tag.trim();
    _question.question = _question.question.trim();
    _question.choices = choices;
    _question.answers = answers;

    if (_question.choices.some((text) => !text.length)) {
      window.alert('Ошибка. Указан пустой ответ!');
      return;
    }

    if (!_question.answers.length) {
      window.alert('Ошибка. Не задано ни одного верного ответа');
      return;
    }

    if (!_question.tag) {
      window.alert('Ошибка. Не задано имя категории');
      return;
    }

    if (!_question.question) {
      window.alert('Ошибка. Не задан текст вопроса');
      return;
    }

    close();
    events.$emit(EVENT_SAVE, { question: _question });
  });

  on('.b-modal-edit-question__close', 'click', () => {
    close();
  });

  on('.b-modal-edit-question__delete-btn', 'click', () => {
    if (confirm('Уверены что хотите удалить ?')) {
      events.$emit(EVENT_DELETE, { question });
      close();
    }
  });

  on('.b-modal-edit-question__add-btn', 'click', () => {
    el.querySelector('.b-modal-edit-question__choices').insertAdjacentHTML('beforeEnd', choiceRow());

    initRemoveRowListeners();
  });

  on('.b-modal-edit-question__close-btn', 'click', () => {
    close();
  });
})
