import { 
    FILTER_ADD_SEARCH_TERM,
    FILTER_REMOVE_SEARCH_TERM,
    FILTER_CLEAR_ALL
} from '../constants/filter.constant';
import _omit from 'lodash.omit';

export const filterReducer = (state = {}, action) => {
    switch (action.type) {
        case FILTER_ADD_SEARCH_TERM:
            return { ...state, searchTerm: action.payload };
        case FILTER_REMOVE_SEARCH_TERM:
            return _omit(state, 'searchTerm');
        case FILTER_CLEAR_ALL:
            return {};
        default:
            return state;
    }
};