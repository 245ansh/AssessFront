
import { createBrowserRouter} from 'react-router-dom'
import App from '../App'
import Home from '../pages/Home'
import AuthForm from '../pages/AuthForm'
import StudentDashboard from '../pages/StudentDashboard'
import TeacherDashboard from '../pages/TeacherDashboard'
import ClassDetails from '../pages/ClassDetails'
import QuizForm from '../pages/QuizForm'
import TeacherClass from '../pages/TeacherClass'
import TeacherLogin from '../pages/TeacherLogin'
import QuizSolution from '../pages/QuizSolution'
import Features from '../pages/Features'
import About from '../pages/About'
import AssessmentAttempt from '../pages/AssessmentAttempt'
const router = createBrowserRouter([
    {
        path: "/",
        element :<App/>,
        children :[
            {
              path:"/",
              element: <Home/>  
         },
         {
            path:"/student-dashboard",
            element:<StudentDashboard/>
         },
         {
            path:"/teacher-dashboard",
            element:<TeacherDashboard/>
         },
         {
            path:"/authform",
            element:<AuthForm/>
         },
         {
            path:"/classroom/:classcode",
            element:<ClassDetails/>
         },
         {
            path:"/quizform/:quizcode",
            element:<QuizForm/>
         },
         {
            path:"teacher-class/:classcode",
            element:<TeacherClass/>
         },
         {
            path:"/teacher-login",
            element:<TeacherLogin/>
         },
         {
            path:"/quiz-solution",
            element:<QuizSolution/>
         },
         {
            path:"/features",
            element:<Features/>
         },
         {
            path:"/about",
            element:<About/>
         },{
            path:"/classroom/:classcode/assessment/:assessmentId",
            element:<AssessmentAttempt/>
         }
        ]
    }
])

export default router