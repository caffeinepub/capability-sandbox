import Text "mo:core/Text";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";

actor {
  type Note = {
    id : Nat;
    title : Text;
    body : Text;
  };

  module Note {
    public func compareById(note1 : Note, note2 : Note) : Order.Order {
      Nat.compare(note1.id, note2.id);
    };
  };

  var counter = 0;
  var nextNoteId = 0;
  let notes = Map.empty<Nat, Note>();

  public query ({ caller }) func greet(name : Text) : async Text {
    "Hello, " # name # "!";
  };

  public shared ({ caller }) func add(a : Nat, b : Nat) : async Nat {
    a + b;
  };

  public shared ({ caller }) func increment() : async Nat {
    counter += 1;
    counter;
  };

  public query ({ caller }) func getCount() : async Nat {
    counter;
  };

  public query ({ caller }) func echo(message : Text) : async Text {
    message;
  };

  public shared ({ caller }) func addNote(title : Text, body : Text) : async Nat {
    let id = nextNoteId;
    let note : Note = {
      id;
      title;
      body;
    };
    notes.add(id, note);
    nextNoteId += 1;
    id;
  };

  public query ({ caller }) func getNotes() : async [Note] {
    notes.values().toArray().sort(Note.compareById);
  };
};
