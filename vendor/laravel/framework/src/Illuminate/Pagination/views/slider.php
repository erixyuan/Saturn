<?php
	$presenter = new Illuminate\Pagination\BootstrapPresenter($paginator);
?>

<?php if ($paginator->getLastPage() > 1): ?>
	<div class="fn-clear g-pagination g-pagination-slider">
		<ul class="fn-clear">
			<?php echo $presenter->render(''); ?>
		</ul>
	</div>
<?php endif; ?>