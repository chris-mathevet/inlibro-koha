package Koha::Plugin::NoelTheme;
use Modern::Perl;
use base qw(Koha::Plugins::Base);
use C4::Context;
use URI::Escape;
use JSON;
use Koha::Plugins;

our $VERSION = '1.0';
our $metadata = {
    name   => 'NoelTheme',
    author => 'Ludovic Julien',
    description => 'Ajouter des theme saisonnier dans l’OPAC',
    date_authored => '2025-09-09',
    version => $VERSION,
     minimum_version => '22.05.00',
};

sub new {
    my ($class, $args) = @_;
    $args->{metadata} = $metadata;
    return $class->SUPER::new($args);
}

sub api_namespace {
    my ( $self ) = @_;
    return 'OpacTheme-api';
}

sub static_routes {
    my $self = shift;
    my $spec_str = $self->mbf_read('api/staticapi.json');
    my $spec = decode_json($spec_str);
    return $spec;
}

sub opac_head {
    my ($self) = @_;
    my $api_ns = $self->api_namespace;

    my $theme = $self->retrieve_data("selected_theme") // {};
    return qq{
        <link rel="stylesheet" href="/api/v1/contrib/$api_ns/static/css/$theme.css" />
    };
}

sub opac_js {
    my ($self) = @_;
    my $api_ns = $self->api_namespace;

    my $theme = $self->retrieve_data("selected_theme") // {};
    return "" if $theme eq 'stvalentin';

    return qq{
        <script src="/api/v1/contrib/$api_ns/static/js/$theme.js"></script>
    };
}

sub apply_theme {
    my ($self) = @_; 
    my $cgi = $self->{cgi};  

    my $theme   = $cgi->param('theme');
    my $vitesse = $cgi->param('neige_vitesse');
    my $taille  = $cgi->param('taille_flocons');

    $self->store_data({
        selected_theme  => $theme,
        neige_vitesse   => $vitesse,
        taille_flocons  => $taille,
    }, { flatten => 0 });

    print $cgi->header('application/json');
    print JSON::to_json({
        success => JSON::true,
        message => "Thème '$theme' appliqué avec succès",
        theme   => $theme,
        vitesse => $vitesse,
        taille  => $taille,
    });
    print to_json({ success => 1, theme => $theme });
}

sub opac_public {
    my ($self) = @_;
    warn "OPAC BOTTOM APPELER ";
    my $data = $self->retrieve_data() // {};
    my $theme = $data->{"selected_theme"} || 'noel';

    return '' unless $theme eq 'noel';

    return qq{
      <ul class="lightrope">
        <li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li>
        <li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li>li></li><li></li><li></li><li></li>
        <li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li>
    </ul>
    };
}


# Bouton dans l'intranet
sub tool {
    my ($self, $args) = @_;
    my $cgi = $self->{cgi};

    my $koha_session = $cgi->cookie('KohaSession') // $cgi->param('koha_session');

    my $template = $self->get_template({ file => 'homeTheme.tt' });

    $template->param(
        enabled => 1,
        CLASS   => ref $self,
        METHOD  => 'tool',
        api_namespace  => $self->api_namespace,
        koha_session => $koha_session, 
    );

    print $cgi->header(-type => 'text/html', -charset => 'utf-8');
    print $template->output();
}



sub uninstall {
    my ( $self, $args ) = @_;
    my $dbh = C4::Context->dbh;
    my $sth_select = $dbh->prepare("SELECT value FROM systempreferences WHERE variable = 'OpacMainUserBlock'");
    $sth_select->execute();

    my $value;
    if (my $row = $sth_select->fetchrow_hashref) {
        $value = $row->{value};
    }

    my $start_tag = "<!-- Debut plugin noel -->";
    my $end_tag   = "<!-- Fin plugin noel -->";

    if ($value && $value =~ /$start_tag.*?$end_tag/s) {
        $value =~ s/$start_tag.*?$end_tag//s;

        my $sth_update = $dbh->prepare("UPDATE systempreferences SET value = ? WHERE variable = 'OpacMainUserBlock'");
        $sth_update->bind_param(1, $value);
        $sth_update->execute;
        $sth_update->finish;
    }

    my $sth_delete = $dbh->prepare("DELETE FROM plugin_data WHERE plugin_class = ?");
    $sth_delete->execute($self->class());
    $sth_delete->finish;

    $sth_select->finish;

    return 1;
}



1;
