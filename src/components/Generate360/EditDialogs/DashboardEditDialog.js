import React, { Component } from 'react';
import { connect } from 'react-redux';

import DashboardEditComponent from './Supplements/DashboardEditComponent';

// Material-UI
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class DashboardEditDialog extends Component {

 state = {
   // DO NOT create integer-only parameters as they are reserved for data rows
   open: false,
   addRowId: 0,
   updating: false,
 };

 // Create a new row
 addRow = () => {
   // create new row with the current row count
  let newRowName = this.state.addRowId;
  this.setState({
    ...this.state,
    [newRowName]: {
      id: newRowName,
      row_info: '',
      row_public: true,
      row_title: '',
      // set flag that this row is new so that it can be added to database upon submittal
      new: true
    },
    // update the row count id
    addRowId: this.state.addRowId + 1
  })

  this.scrollToBottom();
 } // end addRow

 // Delete a row
 deleteRow = (id) => {
   this.setState({
     ...this.state,
     // replace row's content with 'deleted' string so the row is deleted from database upon submittal
     [id]: 'deleted'
   })
 } // end deleteRow

 // Update the rows array when a textbox is typed in.
 handleChangeFor= (event, id) => {
  event.preventDefault();

  this.setState({
    [id]: {
      ...this.state[id],
      [event.target.name]: event.target.value,
      // set flag that this row has been updated so that it can be updated in database upon submittal 
      updated: true
    }
  })
 } // end handleChangeFor

 // handles clicking of the "edit" button. Opens a dialog window.
 handleClickOpen = () => {
  this.props.dispatch({ type: 'FETCH_360_SECTION', payload: {section: 'dashboard', current360Id: this.props.current360Id} });
  this.setState({
    ...this.state,
    open: true,
    updating: true
  })
 } // end handleClickOpen

 // handles clicking of the "save" or "cancel" button from the dailog window 
 // and closes the dialog window.
 handleClickClose = () => {
  this.setState({
    ...this.state,
    open: false
  })
 } // end handleClickClose

 // dispatches an action to update the database with the new values and 
 // calls handleClickClose.
 handleSave = () => {
  this.props.dispatch({ type: 'EDIT_360', payload: {section: 'dashboard', current360Id: this.props.current360Id, data: this.state} })
  this.handleClickClose();
 } // end handleSave

 // called when this.props.reduxState.current360.updateNeeded.[section] is true (set true
 // after the section is updated), this runs to copy the section into local state.
 loadCurrentData = () => {

  // Create blank object to hold information
  let newState = {};

  // Map through current this.state and save parameters that are not integers (row data)
  Object.keys(this.state).map( (key) => {
    if (isNaN(key)) {
      newState[key]=this.state[key]
    } else {
      newState[key]=undefined
    };
    return null;
  });

  let currentSection = this.props.reduxState.current360.dashboard

  // map through results from database pull
  currentSection.map((row,index) => {
    let rowCheck = row;

    // Check if any entries in the row are null and set to empty strings (for happy inputs)
    Object.entries(rowCheck).map((entry) => {
        if (entry[1] == null) {
          rowCheck[entry[0]] = '';
        }
        return null;
      })
    
    // add updated row (with any converted null values) to the newState object
    newState[row.id]=rowCheck;
    return null;
  });

  // Fix updating status and set addRowId in newState
  newState.updating = false;
  if (currentSection.length > 0) {
    newState.addRowId = currentSection[currentSection.length-1].id + 1;
  } else {
    newState.addRowId = 1;
  }
  // Set state to newState object
  this.setState( newState );

  // Dispatch action to indicate the update has been completed
  this.props.dispatch({ type: 'CURRENT_360_SECTION_UPDATE_COMPLETE', payload: {section: 'dashboard'} });

 } // end loadCurrentData

 // Scrolls to the bottom (this.bottom is an empty div at the bottom of the dialog content)
 // when a new row is created to reveal the row
 scrollToBottom = () => {
   // The timeout is in place to make sure the new row has appended before the scroll begins
   setTimeout(() => {
    this.bottom.scrollIntoView({ behavior: "smooth", block: "start" });
   }, 250);
 } // scrollToBottom

 render() {
   const { classes } = this.props;

   // Check if the section information updated since this site was last loaded.
   // A section is re-downloaded each time the edit dialog is opened.
   if (this.props.reduxState.current360.updateNeeded.dashboard === true) {
     this.loadCurrentData();
   }

   return (
     <React.Fragment>
      <Button size="small" color="primary" onClick={this.handleClickOpen}>Edit</Button>
      <Dialog
        open={this.state.open}
        onClose={this.handleClickClose}
        aria-labelledby="dashboard-edit-dialog"
        scroll="paper"
        fullWidth
        maxWidth="lg"
        classes={{paper: classes.paper}}
      >
      {/* Conditionally render a loading message until data is loaded into local state */}
      {(this.state.updating === true) ? 
      <React.Fragment>
        <DialogTitle id="dashboard-edit-dialog">Edit Dashboard</DialogTitle>
        <DialogContent>
          <DialogContentText>
            New information is currently loading...
          </DialogContentText>
        </DialogContent>
      </React.Fragment>
        :
        <React.Fragment>
          <DialogTitle id="dashboard-edit-dialog">Edit Dashboard</DialogTitle>
          <DialogContent id="dashboard-edit-dialog-content" ref={(el) => { this.scroll = el; }}>
            <DialogContentText>
              Remember to save changes before closing this edit dialog.
            </DialogContentText>
            {/* Map through keys of this.state. Only render the edit component for integers (which are 
            reserved for row data) */}
            {Object.keys(this.state).filter((key) => !isNaN(key) && this.state[key] !== undefined && this.state[key] !== 'deleted')
            .map((key,index) => {
              return (
                <DashboardEditComponent key={this.state[key].id} row={this.state[key]} index={index} handleChangeFor={this.handleChangeFor} deleteRow={this.deleteRow} />
              );
            })}
            <div style={{ float:"left", clear: "both" }} ref={(el) => { this.bottom = el; }}>
            </div>
          </DialogContent>
          <DialogActions className={classes.spaceBetween}>
            <div>
              <Button onClick={this.addRow}>Add Row</Button>
            </div>
            <div>
              <Button onClick={this.handleClickClose} color="primary">
                Cancel
              </Button>
              <Button variant="contained" onClick={this.handleSave} color="primary">
                Save Changes
              </Button>
            </div>
          </DialogActions>
        </React.Fragment>
      }
      </Dialog>
    </React.Fragment>
   );
 }
};

const styles = {
  paper: {
    height: 'calc(100% - 96px)'
  },
  spaceBetween: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap'
  }
};

const mapReduxStateToProps = (reduxState) => ({
 reduxState
});

export default connect(mapReduxStateToProps)(withStyles(styles)(DashboardEditDialog));