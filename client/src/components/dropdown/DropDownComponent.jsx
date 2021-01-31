import React from "react";
import "./DropDownComponent.css";
import { MenuItem } from "@material-ui/core";
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const DropDownComponent = (props) => {
  const classes = useStyles();
  const [age, setAge] = React.useState("");

  const options = [
  ];

  const optionsMarkup = options.map((option) => (
    <MenuItem value={option.key}>{option.label}</MenuItem>
  ));

  const handleChange = (event) => {
    setAge(event.target.value);
    props.actionProvider.getNextQuestion(event.target.value);
  };

  return (
    <div className="dropdown-bot-container">
      <FormControl variant="outlined" className={classes.formControl}>
        <Select
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          value={age}
          onChange={handleChange}
          label="Please Select"
        >
          {optionsMarkup}
        </Select>
      </FormControl>
    </div>
  );
};

export default DropDownComponent;
