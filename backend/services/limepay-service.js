

class LimePayService {

    constructor() {
        if (!LimePayService.instance) {
            LimePayService.instance = this;
        }
        return LimePayService.instance;
    }

}

let limePayService = new LimePayService();
module.exports = limePayService;

