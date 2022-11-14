// @ts-ignore
import { useState } from "react";
import {
  Button,
  Container,
  Row,
  Col,
  Tooltip,
  OverlayTrigger,
} from "react-bootstrap";
import { useForm } from "react-hook-form";
import "../DonorForm/DonorForm.css";
import { db } from "../../config/firebase";
import { collection, doc, setDoc } from "firebase/firestore";

import { useNavigate } from "react-router-dom";

import axios from "axios";
type VolunteerFormType = {
  isOrg: boolean;
  volunteerName: string;
  volunteerPhone: number;
  volunteerEmail: string;
  volunteerOrgName: string;
  volunteerDOB: Date;
  volunteerAmount: number;
  volunteerHours: number;
  volunteerPostcode: number;
  volunteerComment: string;
  volunteerHowHeard: string;
  volunteerHowHeardOther: string;
  howContribute: string;
  Monday: boolean;
  Tuesday: boolean;
  Wednesday: boolean;
  Thursday: boolean;
  Friday: boolean;
  Saturday: boolean;
  Sunday: boolean;
  Skills: string;
};

function VolunteerForm(props: any) {
  let navigate = useNavigate();

  const {
    getValues,
    register,
    watch,

    formState: { errors, isValid },
  } = useForm<VolunteerFormType>({
    mode: "onChange",
  });

  const isOrgChecked = watch("isOrg");

  const [showOption, setShowOption] = useState(false);

  const [formAttemptedIncomplete, setFormAttemptedIncomplete] = useState(false);
  const [proceedFlag, setProceedFlag] = useState(false);

  const daysTooltip = (props: any) => (
    <Tooltip {...props}>
      Pick your preferred days! but if you can't decide now then you can leave
      this blank
    </Tooltip>
  );
  const volunteerAmountTooltip = (props: any) => (
    <Tooltip {...props}>
      Enter the amount of volunteers in your organisation! but if you can't
      decide now then you can leave this blank
    </Tooltip>
  );

  const proceed = () => {
    if (!isValid) {
      setFormAttemptedIncomplete(true);
    } else {
      getValues();
      setProceedFlag(true);
    }
  };
  const returnToForm = () => {
    setProceedFlag(false);
  };

  async function volunteerDonate() {
    try {
      // console.log(getValues().volunteerDOB)
      const docRef = doc(
        collection(db, `Organisations/${props.orgId}/VolunteerDonations`)
      );

      await setDoc(docRef, {
        volunteerName: getValues().volunteerName,
        volunteerPhone: getValues().volunteerPhone,
        volunteerEmail: getValues().volunteerEmail,
        volunteerOrgName: getValues().volunteerOrgName
          ? getValues().volunteerOrgName
          : "",
        volunteerDOB: getValues().volunteerDOB,
        volunteerAmount: getValues().volunteerAmount
          ? getValues().volunteerAmount
          : "",
        volunteerHours: getValues().volunteerHours,
        volunteerPostcode: getValues().volunteerPostcode,
        volunteerComment: getValues().volunteerComment,
        volunteerHowHeard: getValues().volunteerHowHeard,
        volunteerHowHeardOther: getValues().volunteerHowHeardOther
          ? getValues().volunteerHowHeardOther
          : "",
        howContribute: getValues().howContribute,
        Skills: getValues().Skills,
        Monday: getValues().Monday,
        Tuesday: getValues().Tuesday,
        Wednesday: getValues().Wednesday,
        Thursday: getValues().Thursday,
        Friday: getValues().Friday,
        Saturday: getValues().Saturday,
        Sunday: getValues().Sunday,
      });

      const generalURL = `${process.env.REACT_APP_API_URL}mail/volunteer-info`;
      axios
        .post(generalURL, {
          orgName: props.orgName,
          name: getValues().volunteerName,
          organisationFlag: getValues().isOrg,
          organisationName: getValues().volunteerOrgName,
          numVolunteers: getValues().volunteerAmount,
          individualFlag: !getValues().isOrg,
          dob: getValues().volunteerDOB,
          phone: getValues().volunteerPhone,
          email: getValues().volunteerEmail,
          postcode: getValues().volunteerPostcode,
          hours: getValues().volunteerHours,
          monday: getValues().Monday,
          tuesday: getValues().Tuesday,
          wednesday: getValues().Wednesday,
          thursday: getValues().Thursday,
          friday: getValues().Friday,
          saturday: getValues().Saturday,
          sunday: getValues().Sunday,

          howContribute: getValues().howContribute,
          skills: getValues().Skills,
          comment: getValues().volunteerComment,
          howHeard: getValues().volunteerHowHeard,
          howHeardOther: getValues().volunteerHowHeardOther,
        })
        .then((response) => {
          navigate("../../success");
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (e) {
      console.log("error", e);
      navigate(`../../volunteererror/${props.orgId}`);
    }
  }

  return (
    <div className="donorInfoContainer">
      <div>
        <p className="formTitle">
          Share your details with us and we will be in touch soon.{" "}
        </p>
        {!proceedFlag && (
          <form>
            <div>
              <label>Name*</label>
              {errors.volunteerName && (
                <span style={{ margin: "20px", fontSize: "x-small" }}>
                  Name cannot be blank
                </span>
              )}
              <input
                type="text"
                {...register("volunteerName", {
                  required: true,
                  pattern: /^[a-zA-Z0-9]/,
                })}
              />
            </div>

            <div className="isOrg">
              <div className="checkbox">
                <input
                  type="checkbox"
                  id="isOrg"
                  value="yes"
                  {...register("isOrg")}
                />
                <label>Registering on behalf of an organisation?</label>
              </div>

              <div className="volunteerOrgInfo">
                <div>
                  <label>Name of organisation*</label>
                  {errors.volunteerOrgName && (
                    <span style={{ margin: "20px", fontSize: "x-small" }}>
                      Organisation name cannot be blank
                    </span>
                  )}
                  <div style={{ display: isOrgChecked ? "block" : "none" }}>
                    <input
                      disabled={!isOrgChecked}
                      type="text"
                      {...register("volunteerOrgName", {
                        pattern: /^[a-zA-Z0-9]/,
                        required: true,
                      })}
                    />
                  </div>

                  <div>
                    <OverlayTrigger
                      placement="top"
                      overlay={volunteerAmountTooltip}
                    >
                      <label>
                        Number of volunteers (optional)<sup>(ℹ️)</sup>
                      </label>
                    </OverlayTrigger>
                    <input
                      disabled={!isOrgChecked}
                      type="number"
                      {...register("volunteerAmount", {
                        pattern: /[1-9]/,
                      })}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label>Date of birth*</label>
                {errors.volunteerDOB && (
                  <span style={{ margin: "20px", fontSize: "x-small" }}>
                    Date of Birth cannot be blank
                  </span>
                )}
                <input
                  type="date"
                  {...register("volunteerDOB", {
                    required: true,
                  })}
                />
              </div>
            </div>

            <div>
              <label>Phone*</label>
              {errors.volunteerPhone && (
                <span style={{ margin: "20px", fontSize: "x-small" }}>
                  Please enter a valid phone number
                </span>
              )}
              <input
                {...register("volunteerPhone", {
                  required: true,
                  maxLength: 10,
                  minLength: 10,
                  pattern:
                    /^[/+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
                })}
              />
            </div>

            <div>
              <label>Email*</label>
              {errors.volunteerEmail && (
                <span style={{ margin: "20px", fontSize: "x-small" }}>
                  Please enter a valid email
                </span>
              )}
              <input
                {...register("volunteerEmail", {
                  required: true,
                  pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                })}
              />
            </div>

            <div>
              <label>Postcode*</label>
              {errors.volunteerPostcode && (
                <span style={{ margin: "20px", fontSize: "x-small" }}>
                  Please enter a valid Postcode
                </span>
              )}
              <input
                type="number"
                {...register("volunteerPostcode", {
                  required: true,
                  maxLength: 4,
                  minLength: 4,
                  pattern: /[1-9]/,
                })}
              />
            </div>

            <div className="volunteerHours">
              <label>Hours available*</label>
              {errors.volunteerHours && (
                <span style={{ margin: "20px", fontSize: "x-small" }}>
                  Please enter an amount
                </span>
              )}
              <input
                type="number"
                {...register("volunteerHours", {
                  required: true,
                  pattern: /[1-9]/,
                })}
              />
            </div>
            <div>
              <label>
                How would you like to contribute? <span>*</span>
              </label>
              {errors.howContribute && (
                <span style={{ margin: "20px", fontSize: "x-small" }}>
                  Contribution cannot be blank
                </span>
              )}
              <input
                type="text"
                {...register("howContribute", {
                  required: true,
                })}
              />
            </div>
            <hr />
            <div>
              <OverlayTrigger placement="top" overlay={daysTooltip}>
                <label>
                  Days available (optional)<sup>(ℹ️)</sup>
                </label>
              </OverlayTrigger>
              <div className="availablity">
                <div>
                  <div className="checkbox">
                    <input
                      type="checkbox"
                      id="Monday"
                      {...register("Monday")}
                    ></input>{" "}
                    <label>Monday</label>
                  </div>

                  <div className="checkbox">
                    <input
                      type="checkbox"
                      id="Tuesday"
                      {...register("Tuesday")}
                    ></input>
                    <label>Tuesday</label>
                  </div>
                  <div className="checkbox">
                    <input
                      type="checkbox"
                      id="Wednesday"
                      {...register("Wednesday")}
                    ></input>
                    <label>Wednesday</label>
                  </div>
                  <div className="checkbox">
                    <input
                      type="checkbox"
                      id="Thursday"
                      {...register("Thursday")}
                    ></input>
                    <label>Thursday</label>
                  </div>
                </div>
                <div>
                  <div className="checkbox">
                    <input
                      type="checkbox"
                      id="Friday"
                      {...register("Friday")}
                    ></input>
                    <label>Friday</label>
                  </div>
                  <div className="checkbox">
                    <input
                      type="checkbox"
                      id="Saturday"
                      {...register("Saturday")}
                    ></input>
                    <label>Saturday</label>
                  </div>
                  <div className="checkbox">
                    <input
                      type="checkbox"
                      id="Sunday"
                      {...register("Sunday")}
                    ></input>
                    <label>Sunday</label>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label>Skills (optional)</label>
              <input type="text" {...register("Skills")}></input>
            </div>
            <div>
              <label>Comment (optional)</label>
              <input type="text" {...register("volunteerComment")} />
              <label>How did you hear about us? (optional)</label>
              <select
                {...register("volunteerHowHeard")}
                className="input"
                id="designation"
                onChange={(e) => {
                  if (e.target.value === "Other") setShowOption(true);
                  else setShowOption(false);
                }}
              >
                <option style={{ display: "none" }} value="">
                  Please Select
                </option>
                <option value="WordOfMouth">Word of Mouth</option>
                <option value="Facebook">Facebook</option>
                <option value="Instagram">Instagram</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {showOption ? (
              <div className="field">
                <label className="label">How did you find out about us</label>
                <div className="control ">
                  <input
                    {...register("volunteerHowHeardOther")}
                    className="input"
                    type="text"
                  />
                </div>
              </div>
            ) : (
              ""
            )}

            <div
              style={{
                marginTop: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              {!isValid && formAttemptedIncomplete && (
                <div>Please complete the form.</div>
              )}

              <Button
                className="proceedPayBtn"
                variant="warning"
                onClick={proceed}
              >
                Register your interest
              </Button>
            </div>
          </form>
        )}

        {proceedFlag && (
          <>
            <div style={{ marginBottom: "10px" }}>
              <div>Hi {getValues().volunteerName},</div>

              <div>
                {getValues().volunteerOrgName
                  ? `Your organisation is volunteering${
                      getValues().volunteerAmount
                        ? " " + getValues().volunteerAmount + " people"
                        : ""
                    }`
                  : `You are offering to volunteer`}{" "}
                {}
              </div>
              {getValues().volunteerComment && (
                <div>{`With comment "${getValues().volunteerComment}"`}</div>
              )}

              <div>Hours: {getValues().volunteerHours}</div>
              <div>Email: {getValues().volunteerEmail}</div>
              <div>Phone: {getValues().volunteerPhone}</div>
              <div>You would like to help by {getValues().howContribute}</div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Button variant="outline-secondary" onClick={returnToForm}>
                Something looks wrong, edit my contribution
              </Button>
              <Button
                className="proceedPayBtn"
                variant="warning"
                onClick={volunteerDonate}
              >
                Looks good, send in my application!
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
export default VolunteerForm;
