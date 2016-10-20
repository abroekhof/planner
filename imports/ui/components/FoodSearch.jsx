import React, { PropTypes, Component } from 'react';

import { analytics } from 'meteor/okgrow:analytics';

import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import ActionSearch from 'material-ui/svg-icons/action/search';
import ContentClear from 'material-ui/svg-icons/content/clear';

import classNames from 'classnames';

/**
 * A form to search for foods
 * @extends Component
 */
export default class FoodSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchString: '',
      searched: false,
    };
    this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClear = this.handleClear.bind(this);
  }

  handleTextFieldChange(e) {
    this.setState({ searchString: e.target.value, searched: false });
  }

  handleSubmit(e) {
    e.preventDefault();
    analytics.track('Searched foods', { searchString: this.state.searchString });
    this.setState({ searched: true });
    this.props.searchString.set(this.state.searchString);
  }

  handleClear() {
    this.setState({ searchString: '', searched: false });
    this.props.searchString.set('');
  }

  render() {
    return (
      <form className={classNames('row', 'middle-xs', 'center-xs')} onSubmit={this.handleSubmit}>
        <div className={classNames('col-xs-8')}>
          <TextField
            autoComplete="off"
            id="foodFilter"
            floatingLabelText="Filter foods"
            floatingLabelFixed
            value={this.state.searchString}
            onChange={this.handleTextFieldChange}
            fullWidth
          />
        </div>
        <div className={classNames('col-xs-4')}>
          {
            this.state.searched ?
              <FlatButton primary icon={<ContentClear />} onTouchTap={this.handleClear} /> :
              <FlatButton primary icon={<ActionSearch />} type="submit" />
          }
        </div>
      </form>
    );
  }
}

FoodSearch.propTypes = {
  searchString: PropTypes.object.isRequired,
};
