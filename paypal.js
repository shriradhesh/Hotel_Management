const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');

function environment() {
    let clientId = "AYY9o1pPcCajxDPqti-L21aF7Oz44k6p6n7IuvI7YBtk2viOQ7GWOJvxUvdiMPhh6gL6MCXlibgmy08b";
    let clientSecret = "EK41M2P6DxqAlbXdn0ehAum_cr0F8-KN-H2X1LdfIRaVVXspEn-hO6GeRdRpVYlyEH2icROCgGjUSlwM";

    return new checkoutNodeJssdk.core.SandboxEnvironment(clientId, clientSecret);
    // For live environment, use:
    // return new checkoutNodeJssdk.core.LiveEnvironment(clientId, clientSecret);
}

function client() {
    return new checkoutNodeJssdk.core.PayPalHttpClient(environment());
}

module.exports = { client };
