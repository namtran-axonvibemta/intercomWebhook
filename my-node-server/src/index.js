import express from "express";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));
app.use(express.static(path.join(__dirname)));

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

/*
  These objects define the canvases that will display in your app, including textareas, inputs, and buttons.
  More information on these can be found in the reference docs.
  Canvas docs: https://developers.intercom.com/docs/references/canvas-kit/responseobjects/canvas/
  Components docs: https://developers.intercom.com/docs/references/canvas-kit/interactivecomponents/button/
*/
const initialCanvas = {
  canvas: {
    content: {
      components: [
        {
          type: "text",
          id: "feedback",
          text: "Leave us some feedback:",
          align: "center",
          style: "header",
        },
        {
          type: "textarea",
          id: "description",
          label: "Description",
          placeholder: "",
        },
        {
          type: "single-select",
          id: "csat",
          label: "How would you rate your satisfaction with our product?",
          options: [
            {
              type: "option",
              id: "dissatisfied",
              text: "Dissatisfied"
            },
            {
              type: "option",
              id: "neutral",
              text: "Neutral"
            },
            {
              type: "option",
              id: "satisfied",
              text: "satisfied"
            }
          ]
        },
        {
          type: "button",
          label: "Submit",
          style: "primary",
          id: "submit_button",
          action: {
            type: "submit",
          },
        },
      ],
    },
  },
};


const finalCanvas = {
  canvas: {
    content: {
      components: [
        {
          type: "text",
          id: "thanks",
          text: "Thanks for letting us know!",
          align: "center",
          style: "header",
        },
        {
          type: "button",
          label: "Submit another",
          style: "primary",
          id: "refresh_button",
          action: {
            type: "submit",
          },
        },
      ],
    },
  },
};

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

/*
  This is an endpoint that Intercom will POST HTTP request when the card needs to be 
  initialized.
  
  This can happen when your teammate inserts the app into a conversation composer, 
  Messenger home settings or User Message.
  
  Learn more: https://developers.intercom.com/docs/build-an-integration/getting- 
  started/build-an-app-for-your-messenger/request-flows/#initialize-flow
*/
app.post("/initialize", (request, response) => {
  response.send(initialCanvas);
});

/*
  When a submit action is taken in a canvas component, it will hit this endpoint.

  You can use this endpoint as many times as needed within a flow. You will need 
  to set up the conditions that will show it the required canvas object based on a 
  user/contact's actions.

  In this example, if a user has clicked the initial submit button, it will show 
  them the final thank you canvas. If they click the refresh button to submit 
  another, it will show the initial canvas once again to repeat the process.
*/
app.post("/submit", (request, response) => {
  // Log the incoming submission to the server console
  console.log("Canvas form submission received:", request.body);

  if (request.body.component_id == "submit_button") {
    response.send(finalCanvas);
  } else {
    response.send(initialCanvas);
  }
});