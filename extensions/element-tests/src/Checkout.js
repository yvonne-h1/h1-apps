import { extension, TextField, Icon, InlineLayout,Text,TextBlock, Banner, BlockStack, Button } from "@shopify/ui-extensions/checkout";

// export default extension("purchase.checkout.block.render", renderApp);
export default extension("purchase.checkout.contact.render-after", renderApp);

function renderApp(root, { extension, i18n }) {

  const textField = root.createComponent(TextField, {
    label: "Your age",
    type: "number",
    onChange: setAge,
  });

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

  const banner = root.createComponent(
      Banner,
      { title: "Oh hi!!",
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
    //
  //   root.createComponent(
  //     TextField,
  //     { label: "Hi!",
  //     type: "number",
  //     onChange: setAge, }
  //   )
};

function buttonClick() {
  console.log('on click');
}
function setAge() {
  console.log('on change');
}