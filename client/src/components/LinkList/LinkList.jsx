import React from "react";
import "./LinkList.css";
import Slider from "@material-ui/core/Slider";
import { withStyles, makeStyles } from "@material-ui/core/styles";

const LinkList = (props) => {
  const classes = useStyles();
  const [value, setValue] = React.useState();

  console.log(props);

  const linkMarkup = props.options.map((link) => (
    <li key={link.id} className="link-list-item">
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className="link-list-item-url"
      >
        {link.text}
      </a>
    </li>
  ));

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
    props.actionProvider.getNextQuestion(JSON.stringify(newValue))
  };

  return (
    <div className={classes.root}>
      <PrettoSlider
        valueLabelDisplay="on"
        aria-label="pretto slider"
        defaultValue={20} 
        onChange={handleSliderChange}
      />
    </div>
  );
};

export default LinkList;

const PrettoSlider = withStyles({
  root: {
    color: "#282c34",
    height: 8,
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: "skyblue",
    border: "2px solid currentColor",
    marginTop: -8,
    marginLeft: -12,
    "&:focus, &:hover, &$active": {
      boxShadow: "inherit",
    },
  },
  active: {},
  valueLabel: {
    left: "calc(-50% + 4px)",
  },
  track: {
    height: 8,
    borderRadius: 4,
  },
  rail: {
    height: 8,
    borderRadius: 4,
  },
})(Slider);

const useStyles = makeStyles((theme) => ({
  root: {
    width: 300 + theme.spacing(3) * 2,
  },
  margin: {
    height: theme.spacing(3),
  },
}));
