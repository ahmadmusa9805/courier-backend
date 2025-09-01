import { Router } from 'express';
import { AuthRoutes } from '../modules/Auth/auth.route';
import { UserRoutes } from '../modules/User/user.route';
import { OtpRoutes } from '../modules/Otp/otp.route';
import { AboutUsRoutes } from '../modules/AboutUs/AboutUs.route';
import { PrivacyRoutes } from '../modules/Privacy/Privacy.route';
import { TermRoutes } from '../modules/Term/Term.route';
import { ContactRoutes } from '../modules/Contact/Contact.route';
import { NotificationRoutes } from '../modules/Notification/Notification.route';
import { ProjectRoutes } from '../modules/Project/Project.route';
import { AnalyticRoutes } from '../modules/Analytic/Analytic.route';
import { QuoteRoutes } from '../modules/Quote/Quote.route';
import { InterimRoutes } from '../modules/Interim/Interim.route';
import { LabourRoutes } from '../modules/Labour/Labour.route';
import { LabourExpenseRoutes } from '../modules/LabourExpense/LabourExpense.route';
import { MaterialExpenseRoutes } from '../modules/MaterialExpense/MaterialExpense.route';
import { SubContractorRoutes } from '../modules/SubContractorExpense/SubContractor.route';
import { LiveProjectCostRoutes } from '../modules/LiveProjectCost/LiveProjectCost.route';
import { NoteRoutes } from '../modules/Note/Note.route';
import { PaymentTrackerRoutes } from '../modules/PaymentTracker/PaymentTracker.route';
import { CertificateRoutes } from '../modules/Certificate/Certificate.route';
import { DocumentRoutes } from '../modules/Document/Document.route';
import { DocumentSubfolderRoutes } from '../modules/DocumentSubfolder/DocumentSubfolder.route';
import { DocumentFileRoutes } from '../modules/DocumentFile/DocumentFile.route';
import { SitePictureRoutes } from '../modules/SitePictureFolder/SitePicture.route';
import { SitePictureImageRoutes } from '../modules/SitePictureImage/SitePictureImage.route';
import { SiteReportRoutes } from '../modules/SiteReport/SiteReport.route';
import { SecondFixFolderRoutes } from '../modules/SecondFixFolder/SecondFixFolder.route';
import { SecondFixSubFolderRoutes } from '../modules/SecondFixSubFolder/SecondFixSubFolder.route';
import { SecondFixFileRoutes } from '../modules/SecondFixFile/SecondFixFile.route';
import { HandoverRoutes } from '../modules/Handover/Handover.route';
import { HandoverCombineRoutes } from '../modules/HandoverCombine/HandoverCombine.route';
import { TimeScheduleRoutes } from '../modules/TimeSchedule/TimeSchedule.route';
import { SnaggingRoutes } from '../modules/Snagging/Snagging.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/projects',
    route: ProjectRoutes, // Assuming you have a ProjectRoutes defined  
  },
  {
    path: '/otps',
    route: OtpRoutes,
  },
  {
    path: '/abouts',
    route: AboutUsRoutes,
  },
  {
    path: '/privacies',
    route: PrivacyRoutes,
  },
  {
    path: '/terms',
    route: TermRoutes,
  },
  {
    path: '/contacts',
    route: ContactRoutes,
  },
  {
    path: '/notifications',
    route: NotificationRoutes,
  },
  {
    path: '/analytics',
    route: AnalyticRoutes,
  },
  {
    path: '/quotes',
    route: QuoteRoutes, // Assuming you have a QuoteRoutes defined
  },
  {
    path: '/interims',
    route: InterimRoutes,
  },
  {
    path: '/labours',
    route: LabourRoutes, 
  },
  {
    path: '/labour-expenses',
    route: LabourExpenseRoutes, 
  },
  {
    path: '/material-expenses',
    route: MaterialExpenseRoutes, 
  },
  {
    path: '/sub-contractor-expenses',
    route: SubContractorRoutes, 
  },
  {
    path: '/live-project-costs',
    route: LiveProjectCostRoutes, 
  },
  {
    path: '/notes',
    route: NoteRoutes, 
  },
  {
    path: '/payment-trackers',
    route: PaymentTrackerRoutes, 
  },
  {
    path: '/certificates',
    route: CertificateRoutes, 
  },
  {
    path: '/documents',
    route: DocumentRoutes, 
  },
  {
    path: '/sub-documents',
    route: DocumentSubfolderRoutes, 
  },
  {
    path: '/document-files',
    route: DocumentFileRoutes, 
  },
  {
    path: '/site-pictures',
    route: SitePictureRoutes,
  },
  {
    path: '/site-picture-images',
    route: SitePictureImageRoutes,
  },
  {
    path: '/site-reports',
    route: SiteReportRoutes,
  },
  {
    path: '/second-fix-folders',
    route: SecondFixFolderRoutes,
  },
  {
    path: '/sub-second-fix-folders',
    route: SecondFixSubFolderRoutes,
  },
  {
    path: '/second-fix-files',
    route: SecondFixFileRoutes,
  },
  {
    path: '/handovers',
    route: HandoverRoutes,
  },
  {
    path: '/handover-combines',
    route: HandoverCombineRoutes,
  },
  {
    path: '/time-schedules',
    route: TimeScheduleRoutes,
  },
  {
    path: '/snaggings',
    route: SnaggingRoutes,
  },

];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
