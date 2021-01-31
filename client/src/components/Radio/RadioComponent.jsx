import React from "react";
import "./RadioComponent.css";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";

const RadioComponent = (props) => {
    const [selectedValue, setSelectedValue] = React.useState('a');

  const options = [
    {
      text: "Yes",
      id: 1,
    },
    { text: "No", id: 2 },
  ];

  const onChangeRadioHandler = (e) => {
    e.preventDefault()
    props.actionProvider.getNextQuestion(e.target.value);
  };

  const optionsMarkup = options.map((option) => (
    <FormControlLabel value="end" control={<Radio value={option.text} color="primary" id={option.id} name={option.text} onChange={onChangeRadioHandler} />} label={option.text} />
  ));

  return (
    <div className="radio-bot-container">
      <FormControl component="fieldset">
        <RadioGroup aria-label="gender" name="customized-radios">
          {optionsMarkup}
        </RadioGroup>
      </FormControl>
    </div>
  );
};

export default RadioComponent;
