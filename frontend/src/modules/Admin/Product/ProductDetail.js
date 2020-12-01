import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { Grid, Button, AppBar, Tab, Tabs } from "@material-ui/core";

import BasicInfoProduct from "./ProductPanel/BasicInfoProduct";
import SeoProduct from "./ProductPanel/SeoProduct";
import TabPanel from "@admin/Components/TabPanel/TabPanel";

import api from "services/axios";

export default function AdminProductDetail() {
  const classes = useStyles();
  const router = useRouter();
  const { product } = router.query;

  const { handleSubmit, errors, control, trigger, reset } = useForm({
    validationSchema: loginSchema,
    shouldUnregister: false,
    mode: "onChange",
  });

  const [value, setValue] = React.useState(0);
  const [error, setError] = React.useState(null);

  const handleChangeTab = (event, newValue) => {
    trigger();
    setValue(newValue);
  };

  const onSubmit = async (values) => {
    try {
      const { data } = await api.put(`/api/product/${product}`, values);
      if (data) {
        toast("Update success!");
        router.replace({
          pathname: "./" + values.slug,
        });
      }
    } catch (err) {     
      toast(err.response.data.message);
    }
  };

  React.useEffect(() => {
    if (!!product) {
      async function fetchData() {
        try {
          const { data } = await api.get(`/api/product/${product}`);
          if (data) {
            const { product } = data;
            reset(product);
          }
        } catch (error) {          
          setError(error.response.data.message);
        }
      }
      fetchData();
    }
  }, [product]);

  return (
    <div className={classes.root}>
      {error && <h1>{error}</h1>}
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChangeTab}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
        >
          <Tab label="Basic info" {...a11yProps(0)} />
          <Tab label="SEO" {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <form onSubmit={handleSubmit(onSubmit)} className={classes.container}>
        <Grid container direction="column">
          <Grid item>
            <TabPanel value={value} index={0}>
              <BasicInfoProduct control={control} errors={errors} />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <SeoProduct control={control} errors={errors} />
            </TabPanel>
          </Grid>
          <Grid item>
            <Button
              disabled={Object.entries(errors).length === 0 ? false : true}
              className={classes.button}
              type="submit"
              variant="outlined"
              aria-label="delete"
              color="primary"
              onClick={async () => {
                const err = await trigger();
              }}
            >
              Save
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      boxShadow: "0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)",
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: "center",
      color: theme.palette.text.secondary,
    },
    container: {
      display: "flex",
      flexWrap: "wrap",
    },
    textField: {
      marginBottom: theme.spacing(1.5),
    },
    dense: {
      marginTop: theme.spacing(2),
    },
    menu: {
      width: 200,
    },
    button: {
      margin: theme.spacing(1),
    },
    extendedIcon: {
      marginRight: theme.spacing(1),
    },
  })
);

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`,
  };
}

const loginSchema = yup.object().shape({
  title: yup.string().required(),
  price: yup.number().required(),
});
