import React from "react";
import "./styles/styles.less";
import { createBrowserRouter } from "react-router-dom";

import Layout from "./components/widgets/layout";
import GoogleAuth from "./components/widgets/google-auth";
import GithubAuth from "./components/widgets/github-auth";

import ContactPage from "./components/pages/contact-page";
import SchedulePage from "./components/pages/schedule-page";
import DVRK from "./components/pages/dvrk-page";
import AboutPage from "./components/pages/about-page";
import HomePage from "./components/pages/home-page";
import CommitteesPage from "./components/pages/committees-page";
import PhotosPage from "./components/pages/photos-page";
import WikiPage from "./components/pages/wiki-page";
import PrivacyPolicy from "./components/pages/privacy-policy-page";
import InfoScreen from "./components/pages/info-screen";
import EditInfoScreen from "./components/pages/info-screen-edit-page";
import PhotoHostScreen from "./components/pages/photo-host-page";
import InvoiceGenerator from "./components/pages/invoice-generator-page";
import NewsScreen from "./components/pages/news-screen-page";
import ScheduleScreen from "./components/pages/schedule-screen-page";
import FaqPage from "./components/pages/faq-page";
import IndividualCommitteePage from "./components/pages/individual-committee-page";

const router = createBrowserRouter([
	{
		element: <Layout />, errorElement: <Layout error />, children: [
			{ path: "/", element: <HomePage /> },
			{ path: "/contact", element: <ContactPage /> },
			{ path: "/about", element: <AboutPage /> },
			{ path: "/committees", element: <CommitteesPage /> },
			{ path: "/faq", element: <FaqPage /> },
			{ path: "/photos", element: <PhotosPage /> },
			{ path: "/schedule", element: <SchedulePage /> },
			{ path: "/privacy-policy", element: <PrivacyPolicy /> },
			{
				path: "/dviki", element: <WikiPage />, children: [
					{ path: ":id/*", element: <WikiPage /> }
				]
			},
			{ path: "/committees/the-board", element: <IndividualCommitteePage committee={"the-board"} /> },
			{ path: "/committees/student-educational-committee", element: <IndividualCommitteePage committee={"student-educational-committee"} /> },
			{ path: "/committees/mega6", element: <IndividualCommitteePage committee={"mega6"} /> },
			{ path: "/committees/concats", element: <IndividualCommitteePage committee={"concats"} /> },
			{ path: "/committees/femmepp", element: <IndividualCommitteePage committee={"femmepp"} /> },
			{ path: "/committees/dv_ops", element: <IndividualCommitteePage committee={"dv_ops"} /> },
			{ path: "/committees/dvarm", element: <IndividualCommitteePage committee={"dvarm"} /> },
			{ path: "/committees/mega7", element: <IndividualCommitteePage committee={"mega7"} /> },

			{
				element: <GoogleAuth />, children: [
					{ path: "/info-screen/edit", element: <EditInfoScreen />, loader: async () => await fetch("/api/info-screen") },
					{ path: "/photos/host", element: <PhotoHostScreen /> },
					{
						path: "/dviki/Hemlisar", element: <WikiPage />, children: [
							{ path: ":id/*", element: <WikiPage /> }
						]
					},
					{ path: "/styrelsen/invoice-generator", element: <InvoiceGenerator /> }
				]
			}
		]
	},
	{ path: "/github-auth/authorised", element: <GithubAuth /> },
	{ path: "/info-screen", element: <InfoScreen />, loader: async () => await fetch("/api/info-screen") },
	{ path: "/newsscreen", element: <NewsScreen /> },
	{ path: "/scscreen", element: <ScheduleScreen /> },

	{ path: "/committees/dvrk", element: <DVRK.MainPage /> },
	{ path: "/committees/dvrk/schedule", element: <DVRK.SchedulePage /> },
	{ path: "/committees/dvrk/schedule/bachelor", element: <DVRK.BachelorSchedulePage /> },
	{ path: "/committees/dvrk/schedule/master", element: <DVRK.MasterSchedulePage /> },
	{ path: "/committees/dvrk/contact", element: <DVRK.ContactPage /> },
	{ path: "/committees/dvrk/form", element: <DVRK.FormPage /> },
	{ path: "/committees/dvrk/bachelor", element: <DVRK.BachelorPage /> },
	{ path: "/committees/dvrk/master", element: <DVRK.MasterPage /> },
]);

export { router };