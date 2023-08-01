<div class="help-narrower position-relative start-50 translate-middle-x">
  <div class="help-main rounded border">
    <nav id="navbar" class="navbar sticky-top px-3 mb-3">
      <div class="navbar-brand help-title">
        <i class="bi bi-question-circle help-icon" />
        Help
      </div>
      <ul class="nav nav-pills">
        <li class="nav-item">
          <a class="nav-link" href="#signing">Creating</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#verifying">Verifying</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#requesting">Requesting</a>
        </li>
      </ul>
    </nav>
    <div
      data-bs-spy="scroll"
      data-bs-target="#navbar"
      data-bs-root-margin="0px 0px -40%"
      data-bs-smooth-scroll="true"
      class="p-3"
    >
      <p>
        Welcome to the IdentitySign help page! Here, you'll find some
        instructions on how to use this application.
      </p>

      <hr />

      <h2 id="signing">Creating a signature</h2>
      <p>
        IdentitySign lets you create signatures with a set of personal data.
        This personal data is verified by a trusted party, such as your
        municipality, and collected through <a
          target="_blank"
          href="https://www.yivi.app/en">Yivi</a
        >. To be able to create signatures, you will first need to install the
        Yivi app on your phone. You can then obtain the cards that contain the
        relevant verified personal data either beforehand or during the signing
        process. For more information on how Yivi works, check out
        <a target="_blank" href="https://www.yivi.app/en/for-me/how-yivi-works"
          >their website</a
        >.
      </p>
      <p>
        When signing a document with IdentitySign, you will be guided through
        three steps:
      </p>
      <ol>
        <li class="step">Selecting a document and personal data</li>
        <p class="less-bottom-margin">
          Select a PDF document on your device and the personal data you want to
          use to create the signature. Your can choose one or more of the
          following options:
        </p>
        <ul>
          <li>Your name (first name + last name)</li>
          <li>Your email address</li>
          <li>Your home address (street, house number, zip code and city)</li>
        </ul>
        <p>A date and timestamp will always be added to the signature.</p>
        <li class="step">Proving your identity with Yivi</li>
        <p>
          When you have completed both previous steps, you can use Yivi to
          disclose the selected personal data and prove who you are. If you do
          not have the relevant data in your Yivi app yet, you can obtain it
          during this step. A QR-code will be displayed which can be scanned
          using the Yivi app (see <a
            target="_blank"
            href="https://www.yivi.app/en/for-me/how-yivi-works"
            >their website</a
          > for more information). By scanning this QR-code, you prove who you are
          and provide this information to IdentitySign so that you can make a signature
          using this information.
        </p>
        <li class="step">Sign your document</li>
        <p>
          An overview of your personal data will be presented and you will now
          be able to sign your document. After signing, the (now signed)
          document will show up as a download in your browser.
        </p>
      </ol>
      <p>
        That's it! You can take the signed document from your downloads and save
        it wherever you would like to. You can also send the signed document to
        someone else, for example by email.
      </p>
      <p>
        <i class="text-primary-emphasis"
          >Please note that IdentitySign signatures only work on <b>digital</b> documents!
          Printed documents will stay display the IdentitySign banner, but no longer
          contain a signature (even when scanned).</i
        >
      </p>

      <hr />

      <h2 id="verifying">Verifying a signature</h2>
      <p>
        To verify a signature, start by selecting a file to verify. Once
        selected, IdentitySign will return one of the following results:
      </p>
      <ul>
        <li class="step">Valid signature</li>
        <p>
          A valid signature was found and the personal data used to create the
          signature is shown. <b
            >Make sure that you check the personal data used to create the
            signature!</b
          >
        </p>
        <li class="step">No signature found</li>
        <p>
          IdentitySign did not find a signature in the selected document. This
          is likely due to selecting a document that either contains no
          signature or is signed using a different application than
          IdentitySign.
        </p>
        <li class="step">Invalid signature</li>
        <p>
          This means that IdentitySign did find a signature, but it is not
          valid. <b>Do not trust the signature on this document!</b>
        </p>
      </ul>
      <h3 id="whentotrust">When should I not trust a document?</h3>
      <p>
        A valid signature does <b>not</b> automatically mean that you should trust
        a document! You should make sure that the document contains personal data
        from the right person. It is also important that you think about whether
        or not the signature of that person is enough to trust a document.
      </p>
      <p>
        For example, say you receive a document signed with the name <i
          class="text-primary-emphasis">John Doe</i
        >, who claims to represent
        <i class="text-primary-emphasis">Company X</i>. While you can be sure
        that the document you have received indeed came from someone named
        <i class="text-primary-emphasis">John Doe</i>, there is <b>no</b>
        guarantuee that this person actually works for
        <i class="text-primary-emphasis">Company X</i> (to guarantuee this, the document
        should be signed with the company name).
      </p>
      <p>
        <i class="text-primary-emphasis"
          ><b>Always visit IdentitySign to check documents!</b> Other websites
          or applications should <b>not</b> be trusted to verify signatures made
          by IdentitySign.</i
        >
      </p>

      <hr />

      <h2 id="requesting">Requesting a signature</h2>
      <p>
        Signatures can be requested by selecting a document and the personal
        data that should be used for the signature. This generates a link that
        can be sent (for example by email) to the person that you want to
        request a signature of.
      </p>
      <p>
        When this link is opened, the requested personal data are pre-selected
        and the only steps required are selecting the document and signing with
        Yivi. <b>Note: the document itself is not included in the link!</b> Make
        sure that the other person either has access to the document or send it along
        with the request link (for example by attaching it to the same email).
      </p>
    </div>
  </div>
  <p class="faq">
    Still have questions? Check out our <a href="/faq"
      >frequently asked questions</a
    >!
  </p>
</div>

<style>
  h2 {
    font-weight: 600;
    margin-bottom: 20px;
  }
  h3 {
    font-weight: 600;
  }
  p {
    font-size: 20px;
  }
  ul {
    margin-bottom: 5px;
  }
  li {
    font-size: 20px;
  }
  .step {
    font-weight: 650;
  }
  .less-bottom-margin {
    margin-bottom: 5px;
  }
  .help-narrower {
    max-width: 1200px;
  }
  .help-main {
    margin-top: 5%;
    height: 70vh;
    overflow-y: scroll;
  }
  .help-title {
    font-size: 25px;
    font-weight: 600;
  }
  .help-icon {
    margin-right: 5px;
  }
  #navbar {
    background-color: var(--bs-secondary-bg);
  }
  .nav-link {
    font-size: 18px;
    font-weight: 600;
    color: var(--bs-body);
  }
  .faq {
    font-size: 16px;
    margin-top: 5px;
  }
</style>
