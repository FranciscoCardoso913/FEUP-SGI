def commit_callback(commit):
    if commit.author_email == b"up202108793@up.pt":
        commit.author_name = b"FranciscoCardoso913"
        commit.author_email = b"franciscocardoso.3003@gmail.com"
    if commit.committer_email == b"up202108793@up.pt":
        commit.committer_name = b"FranciscoCardoso913"
        commit.committer_email = b"franciscocardoso.3003@gmail.com"

