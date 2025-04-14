<div class="helpitem">
  <h1>
    <i class="bi bi-question-circle page-icon"></i> When should I trust (or not trust)
    a document signed with IdentitySign?
  </h1>

  <div id="homelink">
    <a href="/">Return to the homepage</a><br />
    Came here from the verification page? The tab to your document verification should
    still be open!
  </div>

  <p class="main-text">
    Whether or not you should trust a document signed with IdentitySign depends
    on the context. There's a few things you should consider before trusting a
    document based on its signature:
  </p>

  <h3>1. Ensure the document has a valid signature</h3>

  <p class="main-text">
    A document signed using IdentitySign should have a valid signature when
    opened using IdentitySign.
  </p>

  <h3>2. Ensure the signature comes from the right person or organization</h3>

  <p class="main-text">
    Anyone can sign a document using IdentitySign! Therefore, it is important
    that you check who signed the document and whether they have the authority
    to sign this document.
  </p>

  <p class="main-text">
    For example, let's take a concert ticket as example. We expect such a
    document to be signed by the ticket company, not by the concert-goer or
    someone else! Here's what this might look like:
  </p>

  <div class="row gy-3">
    <div class="col-sm">
      <div class="card unhappy">
        <div class="card-body">
          <h5 class="example-header">
            <i class="bi bi-exclamation-triangle"></i> Signed by the concertgoer
          </h5>
          <div class="card attribute-card">
            <div class="card-header">
              <i class="bi bi-person card-icon"></i><b>Name</b>
            </div>
            <div class="card-body">
              <p class="attribute-value text-danger">Alice Allison</p>
              <h6>
                <i class="bi bi-question-circle"></i>
                What does this mean?
              </h6>
              <p class="explainer">
                The document was signed by a person or organization with this
                name.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-sm">
      <div class="card happy">
        <div class="card-body">
          <h5 class="example-header">
            <i class="bi bi-exclamation-triangle"></i> Signed by the ticket company
          </h5>
          <div class="card attribute-card">
            <div class="card-header">
              <i class="bi bi-person card-icon"></i><b>Name</b>
            </div>
            <div class="card-body">
              <p class="attribute-value text-success">TicketCompany LLC</p>
              <h6>
                <i class="bi bi-question-circle"></i>
                What does this mean?
              </h6>
              <p class="explainer">
                The document was signed by a person or organization with this
                name.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  #homelink {
    margin-bottom: 20px;
    color: var(--bs-secondary-color);
  }
  .helpitem {
    margin-top: 5%;
    max-width: 1100px;
    margin-left: auto;
    margin-right: auto;
    align-content: center;
  }
  .example-header {
    margin-bottom: 20px;
  }
  .unhappy {
    color: var(--bs-danger-text-emphasis);
    background-color: var(--bs-danger-bg-subtle);
  }
  .happy {
    color: var(--bs-success-text-emphasis);
    background-color: var(--bs-success-bg-subtle);
  }
  .explainer {
    font-size: 14px;
  }
  .attribute-value {
    font-weight: 500;
  }
</style>
