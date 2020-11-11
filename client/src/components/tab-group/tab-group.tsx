import { Box, makeStyles, Tab, Tabs, Theme, Typography } from "@material-ui/core";
import React from "react";
import { nodeify } from "../../helpers/nodeify.helper";

const useTabGroupStyles = makeStyles((theme: Theme) => ({
  root: {
    //
  },
  tabs: {
    backgroundColor: theme.palette.background.default,
  },
}));


export interface ITab {
  label: string;
  icon?: string | React.ReactElement;
  key?: string;
  accessor: React.ReactChild | (() => React.ReactChild);
}

export interface IMyTabsProps {
  tabs: ITab[]
}

export function TabGroup(props: IMyTabsProps) {
  const { tabs } = props;
  const classes = useTabGroupStyles();
  const [value, setValue] = React.useState(0);
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };
  return (
    <div className={classes.root}>
      <Tabs
        value={value}
        className={classes.tabs}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
      >
        {/* head */}
        {tabs.map((tab, i) => (
          <Tab label={tab.label} icon={tab.icon} key={tab.key ?? i} />
        ))}
      </Tabs>
      {/* bodies */}
      {tabs.map((tab, i) => (
        <TabPanel key={tab.key ?? i} value={value} index={i}>
          {nodeify(tab.accessor)}
        </TabPanel>
      ))}
    </div>
  );
}


interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

const useTabPanelStyles = makeStyles((theme: Theme) => ({
  box: {
    borderRadius: `0 0 ${theme.shape.borderRadius}px ${theme.shape.borderRadius}px`,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
}));


function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  const classes = useTabPanelStyles();

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && (
        <Box
          // borderLeft={2}
          // borderRight={2}
          // borderBottom={2}
          className={classes.box}
          // boxShadow={3}
        >
          <>{children}</>
        </Box>
      )}
    </div>
  );
}





// working example:
// import { Theme } from '@material-ui/core/styles';
// import AppBar from '@material-ui/core/AppBar';
// import Typography from '@material-ui/core/Typography';
// import Box from '@material-ui/core/Box';
// import clsx from 'clsx';
// import { pretty } from '../../helpers/pretty.helper';
// import { nodeify } from '../../helpers/nodeify.helper';


// function MyTabz() {
//   const classes = useStyles();
//   const [value, setValue] = React.useState(0);

//   const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
//     setValue(newValue);
//   };

//   return (
//     <div className={classes.root}>
//       <Tabs
//         value={value}
//         className={classes.tabs}
//         onChange={handleChange}
//         indicatorColor="primary"
//         textColor="primary"
//         variant="scrollable"
//         scrollButtons="auto"
//         aria-label="scrollable auto tabs example"
//       >
//         <Tab label="Item One" />
//         <Tab label="Item Two" />
//         <Tab label="Item Three" />
//         <Tab label="Item Four" />
//         <Tab label="Item Five" />
//         <Tab label="Item Six" />
//         <Tab label="Item Seven" />
//         <Tab label="Item Eight" />
//         <Tab label="Item Nine" />
//       </Tabs>
//       <TabPanel value={value} index={0}>
//         Item One
//       </TabPanel>
//       <TabPanel value={value} index={1}>
//         Item Two
//       </TabPanel>
//       <TabPanel value={value} index={2}>
//         Item Three
//       </TabPanel>
//       <TabPanel value={value} index={3}>
//         Item Four
//       </TabPanel>
//       <TabPanel value={value} index={4}>
//         Item Five
//       </TabPanel>
//       <TabPanel value={value} index={5}>
//         Item Six
//       </TabPanel>
//       <TabPanel value={value} index={6}>
//         Item Seven
//       </TabPanel>
//       {/* <TabPanel value={value} index={7}>
//         Item Eight
//       </TabPanel> */}
//       {/* <TabPanel value={value} index={8}>
//         Item Nine
//       </TabPanel> */}
//     </div>
//   );
// }