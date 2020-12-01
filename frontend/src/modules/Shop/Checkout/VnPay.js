import { Button } from "@material-ui/core";
import api from "services/axios";
import Router from "next/router";

function VnPay({ order }) {
  const onSubmit = async () => {
    try {
      const { data } = await api.post("/api/vnpay", { order });
      if (data) {      
        if (data.code === "00") {
          Router.push(data.vnpUrl);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Button color="secondary" fullWidth type="submit" variant="contained" onClick={() => onSubmit()}>
      Thanh toán
    </Button>
  );
}

export default VnPay;
