import { getFormatDate } from '../utils/utils.js';

const createCommentItemTemplate = (commentsData = {}) => {
  const { author, date, emoji, text } = commentsData;

  return (
    `<li class="film-details__comment">
        <span class="film-details__comment-emoji">
          <img src="./images/emoji/${emoji}.png" width="55" height="55" alt="emoji-smile">
        </span>
      <div>
        <p class="film-details__comment-text">${text}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">
            ${getFormatDate(date, 'YYYY/MM/DD HH:MM')}
          </span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>`
  );
};

export const filmCommentTemplate = (film, commentsItems) => {
  const { comments } = film;

  const commentItemsTemplate = commentsItems
    .filter((item) => comments.some((comment) => item.id === comment))
    .map((item) => createCommentItemTemplate(item));

  return (
    ` <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentItemsTemplate.length}</span></h3>
        <ul class="film-details__comments-list">${commentItemsTemplate.join('')}</ul>
      </section>
    </div>`
  );
};
