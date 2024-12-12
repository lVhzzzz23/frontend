import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes,useParams } from 'react-router-dom';
import ParticipantsLogin from './screens/participants/Login.js';
import Camera from './screens/participants/Step2.js';
import FaceRecognition from "./components/FaceRecognition";
import WelcomePage from './screens/welcome/welcome.js';
import CreateMeeting from './screens/organizer/createMetting.js';
import ParticipantDashboard from './screens/admin/ParticipantDashboard.js';
import PeopleCounter from './components/PeopleCounter.js';
import LoginConference from './screens/organizer/LoginConference.js';
import CreateForm from "./screens/organizer/CreateForm.js";
import AnswerQuestions from './components/AnswerQuestions';
import ConferenceList from './components/ConferenceList';
import QuestionsList from './components/QuestionsList';
import DashboardManage from './screens/organizer/dashboard.js';
import RegisterFace from './screens/face/ResgiterFace.js';
import UserManagement from './screens/organizer/user_dashboard.js';
import InputPage from './screens/face/InputPage.js';
import AttendanceManager from './screens/organizer/AttendanceManager.js';
import UpdateConference from './screens/organizer/UpdateConference.js';
import UserEditForm from './screens/organizer/UserEditForm.js';
import DashboardAdmin from './screens/admin/Dashboard.js';
import QuestionForm from './screens/organizer/QuestionForm.js';
import PendingApproval from './screens/organizer/PendingApproval.js';
import QuestionManagement from "./screens/organizer/QuestionManagement";
import ThankYou from './screens/participants/ThankYou.js';
const App = () => {
  const [userInfo, setUserInfo] = useState({});

  

  return (
    <Router>
      <Routes>
        <Route path="/create-meeting" element={<CreateMeeting />} />
        <Route path="/" element={<WelcomePage />} />
        <Route
          path="/join-conference/:conferenceId" element={<ParticipantsLogin/>}/> 
        <Route path="/recognize" element={<FaceRecognition />} />
        <Route path="/camera" element={<Camera />} />
        <Route path="/pending-approval" element={<PendingApproval />} />
        <Route path='/participant-dashboard' element={<ParticipantDashboard />} />
        <Route path='/video' element={<PeopleCounter />} />
        <Route path='/login_form' element={<LoginConference />} />
        <Route path='/input' element={<InputPage/>}/>
        <Route path="/create-form/:conferenceId" element={<CreateForm />} />
        <Route path="/answer-questions/:conferenceId" element={<AnswerQuestions />} />
        <Route path='/conferencelist' element={<ConferenceList/>}/>
        <Route path="/dashboard/:conferenceId" element={<DashboardManage />}/>
        <Route path="/registerface" element={<RegisterFace />}/>
        <Route path='/users/:conferenceId' element={<UserManagement />}/>
        <Route path='/attendancemanager' element={<AttendanceManager/>}/>
        <Route path="/update-conference/:conferenceId" element={<UpdateConference />} />
        <Route path="/users/edit/:userId" element={<UserEditForm/>} />
        <Route path="/admin" element={<DashboardAdmin/>} />
        <Route path="/thank-you" element={<ThankYou />} />

        <Route path="/conference/:conferenceId" element={<QuestionWrapper />} />
        <Route path="/settings/:conferenceId" element={<QuestionManagement/>} />
      </Routes>
    </Router>
  );

};



const QuestionWrapper = () => {
  const { conferenceId } = useParams();
  return <QuestionForm conferenceId={conferenceId} />;
};

export default App;
