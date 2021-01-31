import React from "react";
import "./LearningOptions.css";
import Button from "@material-ui/core/Button";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
      display: 'flex',
      alignItems: 'flex-start',
      flexWrap: 'wrap'
    },
  },
}));

const LearningOptions = (props) => {
  const classes = useStyles();
  const options = [
    {id: 'Movie', text: 'Movie'},
    {id: 'Web Series', text: 'Web Series'}
  ];

  const handlerEvent = (e) => {
    //dispatch/Emit selected event to Server
    props.actionProvider.getNextQuestion(e.target.innerText);
  };

  const optionsMarkup = options.map((option) => (
    <Button size="small" className="learning-option-button"
      variant="outlined"
      color="primary"
      key={option.id}
      onClick={(e) => handlerEvent(e)}
    >
      {option.text}
    </Button>

    // <button
    //   className="learning-option-button"
    //   key={option.id}
    //   onClick={(e) => handlerEvent(e)}
    // >
    //   {option.text}
    // </button>
  ));

  return (
    <div className="learning-options-container">{optionsMarkup} </div>
  );
};

export default LearningOptions;
