import { extension, Icon, InlineLayout,Text,TextBlock, Banner, BlockStack, Button } from "@shopify/ui-extensions/checkout";

// export default extension("purchase.checkout.block.render", renderApp);
export default extension("purchase.checkout.delivery-address.render-before", renderApp);

function renderApp(root, { buyerJourney, shippingAddress, buyerIdentity }) {
  const postcodeRegex = /^[1-9][0-9]{3} ?[a-z]{2}$/ig;

  let address = shippingAddress?.current;
  shippingAddress?.subscribe((newAddress) => {
    address = newAddress;
  });

  buyerJourney.intercept(({canBlockProgress}) => {
    const result = postcodeRegex.test(address.zip);
    // const url = `https://api.postcode.eu/nl/v1/addresses/postcode/${address.zip}/${houseNumber}/${houseNumberAddition}`
    // https://api.postcode.eu/nl/v1/addresses/postcode/{postcode}/{houseNumber}/{houseNumberAddition}

    return canBlockProgress && !result
      ? {
          behavior: 'block',
          reason: 'Invalid ZIP code',
          errors: [
            {
              message:
                'Sorry, your zip is invalid.',
              // Show an error underneath the country code field
              target:
                '$.cart.deliveryGroups[0].deliveryAddress.zip',
            },
            {
              // In addition, show an error at the page level
              message:
                'Please use a different zip code.',
            },
          ],
        }
      : {
          behavior: 'allow',
        };
    },
  );

  /** Test elements */
  const description = root.createComponent(InlineLayout,
    {
      spacing: "base",
      columns: [64, "fill"],
      blockAlignment: "center",
    },
    [
      root.createComponent(Icon, {
        source: 'bag',
        size: 'large'
      }),
      root.createComponent(Text, {size: "large"}, "We're happy that you're here!")
    ]
  )

  let welcomeMessage = "Get extra benefits when you register for an account."
  if (buyerIdentity.customer.current) {
    const customer = buyerIdentity.customer.current
    welcomeMessage = "Hi, " + customer.firstName;
  }

  const banner = root.createComponent(
      Banner,
      { title: welcomeMessage,
        status: "success",
        collapsible: true,
      }, "Welcome to the checkout!"
      // i18n.translate('welcome', {target: extension.target})
    )

  const banner2 = root.createComponent(
    TextBlock,
      { appearance: "success" }, description
    )
  const button = root.createComponent(
      Button,
      {
        onPress: buttonClick,
      },
      'Button',
    )

  // root.appendChild(textField);
  root.appendChild(
    root.createComponent(BlockStack, { spacing: "loose", background: 'subdued',padding: 'base' }, [
      banner,
      banner2,
      button
    ]),
  )
};

function buttonClick() {
  console.log('on click');
}
function setAge() {
  console.log('on change');
}
