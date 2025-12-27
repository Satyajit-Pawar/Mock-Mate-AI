import Header from "@/components/shared/header";

export default function PrivacyPage() {
  return (
    <>
      <Header />

      <div className="container max-w-4xl py-12 mx-auto">
        <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>

        <div className="prose dark:prose-invert max-w-none">
          <p>
            This Privacy Policy explains how we collect, use, and protect your
            information when you use our platform. This project is created only
            for learning and educational purposes.
          </p>

          <p>
            By using this website, you agree to the collection and use of
            information in accordance with this policy.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-2">
            Information We Collect
          </h2>

          <p>
            We may collect basic information such as your name and email address
            when you register or log in. This information is used only to
            demonstrate authentication and learning features.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-2">Log Files</h2>

          <p>
            Like many websites, this application may use log files. These files
            collect information such as IP addresses, browser type, and time of
            access. This data is used only for learning analytics and debugging
            purposes.
          </p>

          <p>
            The information collected through log files is not linked to any
            personally identifiable data.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-2">
            Use of Information
          </h2>

          <p>
            The collected information is used to improve the learning experience,
            understand user interaction, and demonstrate features such as mock
            interviews and progress tracking.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-2">Consent</h2>

          <p>
            By using this website, you hereby consent to this Privacy Policy and
            agree to its terms.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-2">Contact</h2>

          <p>
            If you have any questions about this Privacy Policy, you can contact
            us for learning-related clarification.
          </p>
        </div>
      </div>
    </>
  );
}

