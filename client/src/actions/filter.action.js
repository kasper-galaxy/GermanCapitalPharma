import {
    FILTER_ADD_SEARCH_TERM,
    FILTER_CLEAR_ALL,
    FILTER_REMOVE_SEARCH_TERM
} from '../constants/filter.constant';

export const addSearchTerm = (term) => ({
    type: FILTER_ADD_SEARCH_TERM,
    payload: term,
});

export const removeSearchTerm = () => ({
    type: FILTER_REMOVE_SEARCH_TERM
})

export const filterClearAll = () => ({
    type: FILTER_CLEAR_ALL,
  });
  