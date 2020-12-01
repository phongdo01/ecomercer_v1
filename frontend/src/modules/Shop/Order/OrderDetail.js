import React from "react";
import { useRouter } from "next/router";

import { makeStyles } from "@material-ui/core/styles";
import { Typography, Container, Grid, ListItemText, List, ListItem } from "@material-ui/core";

import api from "services/axios";
import converPriceVND from "helpers/convertPriceVND";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(3),
  },
  listItem: {
    padding: theme.spacing(1, 0),
  },
  total: {
    fontWeight: 700,
  },
  title: {
    marginTop: theme.spacing(2),
  },
  image: {
    width: "100%",
  },
}));

export default function Order() {
  const classes = useStyles();
  const router = useRouter();
  const { order: orderId } = router.query;
  const [loading, setLoading] = React.useState(true);
  const [order, setOrder] = React.useState(null);

  React.useEffect(() => {
    if (!!orderId) {
      async function fetchData() {
        try {
          const { data } = await api.get(`/api/order/${orderId}`);
          if (data) {
            setLoading(false);
            setOrder(data.order);
          }
        } catch (error) {
          console.log(error);
        }
      }
      fetchData();
    }
  }, [orderId]);

  if (loading) return null;
  if (!!order)
    return (
      <Container>
        <Grid container spacing={2}>
          <Grid item md={8}>
            <div className={classes.root}>
              <Typography variant="h6" gutterBottom>
                Tóm tắt đơn hàng
              </Typography>
              <List disablePadding>
                {order.orderItems.map((item) => (
                  <ListItem className={classes.listItem} key={item.title}>
                    <ListItemText primary={item.title} secondary={item.desc} />
                    <ListItemText primary={`x${item.quantity}`} secondary={item.desc} />
                    <Typography variant="body2">đ{converPriceVND(item.price)}</Typography>
                  </ListItem>
                ))}
                <ListItem className={classes.listItem}>
                  <ListItemText primary="Tổng" />
                  <Typography variant="subtitle1" className={classes.total}>
                    đ{converPriceVND(order.totalPrice)}
                  </Typography>
                </ListItem>
              </List>
              <Grid container spacing={2} justify="space-between">
                <Grid item  md={6}> 
                  <Typography variant="h6" gutterBottom className={classes.title}>
                    Shipping
                  </Typography>
                  <Typography gutterBottom>{order.user.name}</Typography>
                  <Typography gutterBottom>
                    {Object.entries(order.shipping)
                      .map(([key, value]) => value)
                      .join(", ")}
                  </Typography>
                </Grid>
                <Grid item md={6}> 
                  <Typography variant="h6" gutterBottom className={classes.title}>
                    Chi tiết thanh toán
                  </Typography>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography gutterBottom>Phương thức thanh toán</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography gutterBottom>: {order.payment.paymentMethod}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography gutterBottom>Trạng thái thanh toán</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography gutterBottom>: {order.isPaid ? "đã thanh toán" : "chưa thánh toán"}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </div>
          </Grid>
          <Grid item md={4}>
            <img src="/thank-for-purchase.png" className={classes.image} />
          </Grid>
        </Grid>
      </Container>
    );
  return <h1>Ban khong co order nao</h1>;
}
