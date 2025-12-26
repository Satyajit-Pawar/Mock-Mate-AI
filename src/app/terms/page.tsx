import Header from "@/components/shared/header";

export default function TermsPage() {
  return (
    <>
      <Header />
      <div className="container max-w-4xl py-12">
        <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
        <div className="prose dark:prose-invert max-w-none">
          <p>
            Welcome to InterviewAce! These terms and conditions outline the rules and regulations for the use of
            InterviewAce's Website, located at this domain.
          </p>

          <p>
            By accessing this website we assume you accept these terms and conditions. Do not continue to use
            InterviewAce if you do not agree to take all of the terms and conditions stated on this page.
          </p>

          <h2 className="text-2xl font-bold mt-6 mb-2">Cookies</h2>
          <p>
            We employ the use of cookies. By accessing InterviewAce, you agreed to use cookies in agreement with
            the InterviewAce's Privacy Policy.
          </p>

          <h2 className="text-2xl font-bold mt-6 mb-2">License</h2>
          <p>
            Unless otherwise stated, InterviewAce and/or its licensors own the intellectual property rights for
            all material on InterviewAce. All intellectual property rights are reserved. You may access this
            from InterviewAce for your own personal use subjected to restrictions set in these terms and
            conditions.
          </p>

          <p>You must not:</p>
          <ul>
            <li>Republish material from InterviewAce</li>
            <li>Sell, rent or sub-license material from InterviewAce</li>
            <li>Reproduce, duplicate or copy material from InterviewAce</li>
            <li>Redistribute content from InterviewAce</li>
          </ul>

          <p>This Agreement shall begin on the date hereof.</p>

          <h2 className="text-2xl font-bold mt-6 mb-2">Disclaimer</h2>
          <p>
            To the maximum extent permitted by applicable law, we exclude all representations, warranties and
            conditions relating to our website and the use of this website. Nothing in this disclaimer will:
          </p>

          <ul>
            <li>limit or exclude our or your liability for death or personal injury;</li>
            <li>limit or exclude our or your liability for fraud or fraudulent misrepresentation;</li>
            <li>
              limit any of our or your liabilities in any way that is not permitted under applicable law; or
            </li>
            <li>exclude any of our or your liabilities that may not be excluded under applicable law.</li>
          </ul>
        </div>
      </div>
    </>
  );
}
