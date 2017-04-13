'use strict';

import { renderToDom } from 'tiny-component';
import bEditor from './b-editor/b-editor';
import { getObject } from './lib/localstorage';
import { getTestData } from './lib/request';
import resolve from './lib/resolve';
import groupBy from 'lodash/groupBy';
import './index.less';

const MAX_QUESTIONS_IN_TEST = 28;
const MAX_TIME = 30 * 60 * 1000;

resolve({
  auth: () => getObject('auth', { first_name: '', last_name: '', group_number: 0 }),
  test: () => getTestData()
})
.then(resolve.nested({
  questionsByTag: ({ test: { questions } }) =>
    groupBy(questions, (question) =>
      String(question.tag).trim()
    )
}))
.then(({ test, auth, questionsByTag }) => {
  const data = {
    test: test.meta,
    maxTime: MAX_TIME, // 30min
    maxQuestions: MAX_QUESTIONS_IN_TEST,
    auth,
    questions: test.questions,
    questionsByTag,
    questionsById: test.questions.reduce((questions, question) => {
      questions[question.id] = question;

      return questions;
    }, {}),
    tags: Object.keys(questionsByTag)
  };

  console.log(data);

  renderToDom(bEditor(data), document.body, {
    onRender: () => {
      const preloader = document.getElementById('preloader');

      preloader.parentNode.removeChild(preloader);
    }
  });
});

