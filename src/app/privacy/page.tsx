import Header from "@/components/shared/header";

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <div className="container max-w-4xl py-12">
        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
        <div className="prose dark:prose-invert max-w-none">
          <p>
            At InterviewAce, accessible from this domain, one of our main priorities is the privacy of our
            visitors. This Privacy Policy document contains types of information that is collected and recorded by
            InterviewAce and how we use it.
          </p>

          <p>
            If you have additional questions or require more information about our Privacy Policy, do not
            hesitate to contact us.
          </p>

          <h2 className="text-2xl font-bold mt-6 mb-2">Log Files</h2>
          <p>
            InterviewAce follows a standard procedure of using log files. These files log visitors when they
            visit websites. All hosting companies do this and a part of hosting services' analytics. The
            information collected by log files include internet protocol (IP) addresses, browser type, Internet
            Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks.
            These are not linked to any information that is personally identifiable. The purpose of the
            information is for analyzing trends, administering the site, tracking users' movement on the website,
            and gathering demographic information.
          p>

          <h2 className="text-2xl font-bold mt-6 mb-2">Personal Information</h2>
          <p>
            We collect personal information such as your name and email address when you register for an account. We use this information to provide our services to you, including saving your interview history and tracking your progress. We do not share your personal information with third parties except as required by law.
          </p>

          <h2 className="text-2xl font-bold mt-6 mb-2">Consent</h2>
          <p>
            By using our website, you hereby consent to our Privacy Policy and agree to its terms.
          </p>
        </div>
      </div>
    </>
  );
}
