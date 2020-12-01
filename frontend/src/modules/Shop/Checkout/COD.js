import { Button, Container, Grid, TextField } from "@material-ui/core";
import api from "services/axios";
import Router from "next/router";

function COD({ order }) {
  const onSubmit = async () => {
    console.log(order);
    try {
      const { data } = await api.post(`/api/order`, order);
      if (data) {
        Router.push(`/order/${data.order._id}`);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Button color="secondary" fullWidth type="submit" variant="contained" onClick={() => onSubmit()}>
      Đặt hàng
    </Button>
  );
}

export default COD;
