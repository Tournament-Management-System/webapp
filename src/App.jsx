import {
  createBrowserRouter,
  RouterProvider,
  useLocation,
  useNavigate
} from "react-router-dom";
import CompetitorC from "./flows/Competitors/Competitors";
import Judges from "./flows/Judges/Judges";
import Organizers from "./flows/Organizers/Organizers";
import Playground from "./flows/Playground/Playground";

import "./App.scss";
import { useEffect, useState } from "react";
import { DATA_TYPE, fetchAWSData } from "./redux/dataSlice";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Spinner, Form, Button } from "react-bootstrap";
import { Auth, DataStore } from "aws-amplify";
import { FormInput } from "./components/util/FormUtils";
import { Competitor, Judge } from "./models";
import { uiAction } from "./redux/uiSlice";
import { handleUserTypeRedirection } from "./components/util/FunctionUtils";

export const USER_TYPES = {
  ADMIN: "ADMIN",
  ORGANIZER: "ORGANIZER",
  JUDGE: "JUDGES",
  COMPETITOR: "COMPETITOR"
};

function IndexComponent() {
  const dispatch = useDispatch();
  const { search } = useLocation();
  const query = new URLSearchParams(search);

  if (query.get("password") !== "Password1!") {
    return <div>Insufficient privilege</div>;
  }

  return (
    <div>
      <Button
        onClick={async () => {
          dispatch(uiAction.setLoading(true));
          const user = await Auth.currentAuthenticatedUser();
          await Auth.deleteUserAttributes(user, [
            "profile",
            "name",
            "nickname"
          ]);
          console.log("*** reset complete");
          dispatch(uiAction.setLoading(false));
        }}
      >
        Reset user profile
      </Button>
    </div>
  );
}

function Redirection(props) {
  const navigate = useNavigate();
  useEffect(() => {
    handleUserTypeRedirection(navigate);
  }, [navigate]);
  return <></>;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Redirection />
  },
  {
    path: "/tools",
    element: <IndexComponent />
  },
  {
    path: "/playground/*",
    element: <Playground />
  },
  {
    path: "/organizer/*",
    element: <Organizers />
  },
  {
    path: "/judges/*",
    element: <Judges />
  },
  {
    path: "/competitor/*",
    element: <CompetitorC />
  }
]);

function App() {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.ui.loading);
  const [userAttributes, setUserAttributes] = useState(null);

  const [setupInput, setSetupInput] = useState({});

  useEffect(() => {
    (async () => {
      const currentUser = await Auth.currentAuthenticatedUser();
      if (currentUser) {
        setUserAttributes(currentUser.attributes ?? {});
      }
    })();
    Object.keys(DATA_TYPE).forEach((dataType) => {
      fetchAWSData(dispatch, dataType);
    });
  }, [dispatch]);

  if (userAttributes === null) {
    return <div />;
  }

  if (!userAttributes.profile) {
    return (
      <Modal fullscreen show>
        <Modal.Header>
          <Modal.Title>Set up your account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p style={{ margin: "5px 0px 8px 0px", fontSize: 16 }}>
            Select your role
          </p>
          <Form.Select
            value={setupInput.profile}
            onChange={(e) =>
              setSetupInput((si) => ({ ...si, profile: e.target.value }))
            }
          >
            <option>Choose an option</option>
            <option value={USER_TYPES.ORGANIZER}>Organizer</option>
            <option value={USER_TYPES.JUDGE}>Judge</option>
            <option value={USER_TYPES.COMPETITOR}>Competitor</option>
          </Form.Select>
          <div style={{ marginTop: 10 }}>
            <FormInput
              label="Name"
              value={setupInput.name}
              onChange={(e) =>
                setSetupInput((si) => ({ ...si, name: e.target.value }))
              }
            />
          </div>
          <Button
            onClick={async () => {
              if (setupInput.profile && setupInput.name) {
                let nickname;
                if (setupInput.profile === USER_TYPES.JUDGE) {
                  const newJudge = await DataStore.save(
                    new Judge({ name: setupInput.name })
                  );
                  nickname = newJudge.id;
                } else if (setupInput.profile === USER_TYPES.COMPETITOR) {
                  const newCompetitor = await DataStore.save(
                    new Competitor({ name: setupInput.name })
                  );
                  nickname = newCompetitor.id;
                }
                let user = await Auth.currentAuthenticatedUser();
                await Auth.updateUserAttributes(user, {
                  ...setupInput,
                  ...(nickname ? { nickname } : {})
                });
                user = await Auth.currentAuthenticatedUser();
                setUserAttributes(user.attributes);
              }
            }}
          >
            Setup
          </Button>
        </Modal.Body>
      </Modal>
    );
  }

  return (
    <div>
      {loading && (
        <div
          style={{
            position: "absolute",
            zIndex: 50000,
            width: "100vw",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.1)"
          }}
        >
          <Spinner style={{ width: 50, height: 50 }} />
        </div>
      )}
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
