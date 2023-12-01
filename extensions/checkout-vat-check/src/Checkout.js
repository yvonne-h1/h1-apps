import {
  BlockStack,
  Divider,
  extension,
  Heading,
  TextField, Text
} from "@shopify/ui-extensions/checkout";
// Set the entry point for the extension
export default extension("purchase.checkout.contact.render-after", renderApp);

function renderApp(root, { extension, buyerJourney }) {

  // Set the target age that a buyer must be to complete an order
  const vatNr = 123;

  // Set up the app state
  const state = {
    vatNr: "",
    canBlockProgress:  extension.capabilities.current.includes("block_progress"),
  };

  // Set up the text component so that its props can be updated without re-rendering the whole extension
  const textField = root.createComponent(TextField, {
    label: "VAT number",
    type: "number",
    value: state.vatNr,
    onChange: setVat,
    onInput: clearValidationErrors,
    required: state.canBlockProgress,
  });
  // Merchants can toggle the `block_progress` capability behavior within the checkout editor
  extension.capabilities.subscribe((capabilities) => {
    state.canBlockProgress = capabilities.includes("block_progress");
    textField.updateProps({
      label: state.canBlockProgress ? "VAT number" : "VAT number (optional)",
      required: state.canBlockProgress,
    });
  });


  // Use the `buyerJourney` intercept to conditionally block checkout progress
  buyerJourney.intercept(({ canBlockProgress }) => {
    // Validate that the age of the buyer is known, and that they're old enough to complete the purchase
    if (canBlockProgress && !isVatSet()) {
      return {
        behavior: "block",
        reason: "VAT is required",
        perform: (result) => {
          // If progress can be blocked, then set a validation error on the custom field
          if (result.behavior === "block") {
            textField.updateProps({ error: "Enter your VAT" });
          }
        },
      };
    }

    if (canBlockProgress && !isVatValid()) {
      return {
        behavior: "block",
        reason: `VAT is invalid.`,
        errors: [
          {
            // Show a validation error on the page
            message:
              "Your VAT number is not valid. VAT should be 123.",
          },
        ],
      };
    }
    return {
      behavior: "allow",
      perform: () => {
        // Ensure any errors are hidden
        clearValidationErrors();
      },
    };
  });

  function setVat(value) {
    state.vatNr = value;
    textField.updateProps({ value: state.vatNr });
    clearValidationErrors();
  }

  function isVatSet() {
    return state.vatNr !== "";
  }

  function isVatValid() {
    return Number(state.vatNr) === vatNr;
  }

  function clearValidationErrors() {
    textField.updateProps({ error: undefined });
  }

  // Render the extension
  root.appendChild(
    root.createComponent(BlockStack, { spacing: "loose",padding: ['base','none'] }, [
      root.createComponent(Divider),
      root.createComponent(Heading, { level: 2 }, ["Add your VAT number"]),
      textField,
      root.createComponent(Divider),
    ])
  )

}
