import PocketBaseService from "./PocketBaseService";

class PocketPaymentService extends PocketBaseService {

  constructor() {
    super("/api/payments");
  }
}


export default new PocketPaymentService();
