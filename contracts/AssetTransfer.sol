pragma solidity ^0.4.24;

contract AssetTransfer
{
    enum StateType { Active, OfferPlaced, PendingInspection, Inspected, Appraised, NotionalAcceptance, BuyerAccepted, 
    SellerAccepted, Accepted, Terminated }
    address public InstanceOwner;
    string public Description;
    uint public AskingPrice;
    StateType public State;

    address public InstanceBuyer;
    uint public OfferPrice;
    address public InstanceInspector;
    address public InstanceAppraiser;

    event StateChangeEvent(StateType State);
    constructor(string memory description, uint256 price) public
    {
        InstanceOwner = msg.sender;
        AskingPrice = price;
        Description = description;
        State = StateType.Active;
    }
    
    function Terminate() public
    {
        if (InstanceOwner != msg.sender)
        {
            revert("Sender Invalid Role to Terminate.");
        }

        State = StateType.Terminated;
        emit StateChangeEvent(State);        
    }

    function Modify(string memory description, uint256 price) public
    {
        if (State != StateType.Active)
        {
            revert("Instance state is not Active to Modify.");
        }
        if (InstanceOwner != msg.sender)
        {
            revert("Sender Invalid Role to Modify.");
        }

        Description = description;
        AskingPrice = price;
    }

    function MakeOffer(address inspector, address appraiser, uint256 offerPrice) public
    {
        if (address(inspector) == address(0) || address(appraiser) == address(0) || offerPrice == 0)
        {
            revert("Invalid Address or Price to MakeOffer.");
        }
        if (State != StateType.Active)
        {
            revert("Instance state is not Active to MakeOffer.");
        }
        // Cannot enforce "AllowedRoles":["Buyer"] because Role information is unavailable
        if (InstanceOwner == msg.sender) // not expressible in the current specification language
        {
            revert("Sender Invalid Role to MakeOffer.");
        }

        InstanceBuyer = msg.sender;
        InstanceInspector = inspector;
        InstanceAppraiser = appraiser;
        OfferPrice = offerPrice;
        State = StateType.OfferPlaced;
        emit StateChangeEvent(State);
    }

    function AcceptOffer() public
    {
        if (State != StateType.OfferPlaced)
        {
            revert("Offer not yet placed.");
        }
        if (InstanceOwner != msg.sender)
        {
            revert("Sender Invalid Role to AcceptOffer.");
        }

        State = StateType.PendingInspection;
        emit StateChangeEvent(State);        
    }

    function Reject() public
    {
        if (State != StateType.OfferPlaced && State != StateType.PendingInspection && State != StateType.Inspected 
        && State != StateType.Appraised && State != StateType.NotionalAcceptance && State != StateType.BuyerAccepted)
        {
            revert("Invalid state to Reject.");
        }
        if (InstanceOwner != msg.sender)
        {
            revert("Sender Invalid Role to Reject.");
        }

        InstanceBuyer = address(0);
        State = StateType.Active;
        emit StateChangeEvent(State);        
    }

    function Accept() public
    {
        if (msg.sender != InstanceBuyer && msg.sender != InstanceOwner)
        {
            revert("Sender Invalid Role to Accept.");
        }

        if (msg.sender == InstanceOwner && State != StateType.NotionalAcceptance && State != StateType.BuyerAccepted)
        {
            revert("Invalid State or Role to Accept.");
        }

        if (msg.sender == InstanceBuyer && State != StateType.NotionalAcceptance && State != StateType.SellerAccepted)
        {
            revert("Invalid State or Role to Accept.");
        }

        if (msg.sender == InstanceBuyer)
        {
            if (State == StateType.NotionalAcceptance)
            {
                State = StateType.BuyerAccepted;
            }
            else if (State == StateType.SellerAccepted)
            {
                State = StateType.Accepted;
            }
        }
        else
        {
            if (State == StateType.NotionalAcceptance)
            {
                State = StateType.SellerAccepted;
            }
            else if (State == StateType.BuyerAccepted)
            {
                State = StateType.Accepted;
            }
        }
        emit StateChangeEvent(State);
    }

    function ModifyOffer(uint256 offerPrice) public
    {
        if (State != StateType.OfferPlaced)
        {
            revert("There is no Offer to ModifyOffer.");
        }
        if (InstanceBuyer != msg.sender || offerPrice == 0)
        {
            revert("Invalid Role or Offer Price to ModifyOffer.");
        }

        OfferPrice = offerPrice;
    }

    function RescindOffer() public
    {
        if (State != StateType.OfferPlaced && State != StateType.PendingInspection && State != StateType.Inspected 
        && State != StateType.Appraised && State != StateType.NotionalAcceptance && State != StateType.SellerAccepted)
        {
            revert("Invalid State to RescindOffer.");
        }
        if (InstanceBuyer != msg.sender)
        {
            revert("Sender Invalid Role to RescindOffer.");
        }

        InstanceBuyer = address(0);
        OfferPrice = 0;
        State = StateType.Active;
        emit StateChangeEvent(State);
    }

    function MarkAppraised() public
    {
        if (InstanceAppraiser != msg.sender)
        {
            revert("Sender Invalid Role to Appraise.");
        }

        if (State == StateType.PendingInspection)
        {
            State = StateType.Appraised;
        }
        else if (State == StateType.Inspected)
        {
            State = StateType.NotionalAcceptance;
        }
        else
        {
            revert("Invalid State or Sender to Mark Appraisal.");
        }
        emit StateChangeEvent(State);
    }

    function MarkInspected() public
    {
        if (InstanceInspector != msg.sender)
        {
            revert("Sender Invalid Role to Inspect.");
        }

        if (State == StateType.PendingInspection)
        {
            State = StateType.Inspected;
        }
        else if (State == StateType.Appraised)
        {
            State = StateType.NotionalAcceptance;
        }
        else
        {
            revert("Invalid State or Sender to Inspect.");
        }
        emit StateChangeEvent(State);
    }
}